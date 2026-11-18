
import { createClient } from "npm:@supabase/supabase-js@2.118.0";
const client=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,{auth:{persistSession:false,autoRefreshToken:false}});
const origins=new Set(["https://admin.kusiqumir.com"]);
Deno.serve(async(req:Request)=>{
 const origin=req.headers.get("origin");
 const headers:Record<string,string>={"Content-Type":"application/json","Cache-Control":"no-store","Vary":"Origin"};
 if(origin&&origins.has(origin)){
  headers["Access-Control-Allow-Origin"]=origin;
  headers["Access-Control-Allow-Headers"]="authorization,apikey,content-type,x-client-info";
  headers["Access-Control-Allow-Methods"]="POST,OPTIONS";
 }
 const reply=(status:number,value:unknown)=>new Response(JSON.stringify(value),{status,headers});
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers});
 if(req.method!=="POST")return reply(405,{error:"Usa POST."});
 if(origin&&!origins.has(origin))return reply(403,{error:"Origen no permitido."});
 try{
  const text=await req.text();
  if(text.length>8192)return reply(413,{error:"Solicitud demasiado grande."});
  let body:Record<string,unknown>;
  try{const parsed:unknown=JSON.parse(text);if(!parsed||typeof parsed!=="object"||Array.isArray(parsed))return reply(400,{error:"Solicitud inválida."});body=parsed as Record<string,unknown>;}catch{return reply(400,{error:"JSON inválido."});}

  let callerId="";
  {
   const authorization=req.headers.get("authorization")||"";
   if(!authorization.startsWith("Bearer "))return reply(401,{error:"Inicia sesión."});
   const {data:verified,error:authError}=await client.auth.getUser(authorization.slice(7));
   if(authError||!verified.user)return reply(401,{error:"Sesión inválida."});
   callerId=verified.user.id;
   const {data:membership,error:memberError}=await client.from("TourAdministrator").select("role").eq("user_id",callerId).maybeSingle();
   if(memberError)return reply(503,{error:"No se pudieron verificar los permisos."});
   if(membership?.role!=="owner")return reply(403,{error:"Solo el administrador total puede gestionar usuarios."});
  }
  if(body.action==="list"){
   const start=typeof body.start==="number"&&Number.isInteger(body.start)&&body.start>=0?body.start:0;
   const {data:members,error}=await client.from("TourAdministrator").select("user_id,role").order("created_at",{ascending:true}).range(start,start+49);
   if(error)return reply(503,{error:"No se cargaron los usuarios."});
   const rows=await Promise.all((members||[]).map(async(member)=>{
    const {data,error}=await client.auth.admin.getUserById(member.user_id);
    if(error)throw new Error("User lookup failed");
    return {id:member.user_id,email:data.user.email,role:member.role};
   }));
   return reply(200,{users:rows});
  }
  if(body.action==="create"){
   const email=typeof body.email==="string"?body.email.trim().toLowerCase():"";
   const password=body.password;
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||typeof password!=="string"||password.length<8||password.length>128)return reply(400,{error:"Indica correo válido y contraseña de 8 a 128 caracteres."});
   if(body.role!==undefined&&body.role!=="editor")return reply(400,{error:"Las nuevas cuentas se crean como editoras."});
   const {data:created,error}=await client.auth.admin.createUser({email,password,email_confirm:true});
   if(error||!created.user)return reply(409,{error:"No se creó la cuenta. Puede existir o no cumplir la política de contraseñas."});
   const {error:grantError}=await client.from("TourAdministrator").insert({user_id:created.user.id,role:"editor"});
   if(grantError)return reply(503,{error:"Cuenta creada sin acceso; el responsable debe completar los permisos.",id:created.user.id});
   return reply(201,{id:created.user.id,email,role:"editor"});
  }
  if(body.action==="delete"){
   const id=body.user_id;
   if(typeof id!=="string"||!/^[0-9a-f-]{36}$/i.test(id))return reply(400,{error:"Usuario inválido."});
   if(id===callerId)return reply(409,{error:"No puedes eliminar tu propia cuenta."});
   const {data:target,error}=await client.from("TourAdministrator").select("role").eq("user_id",id).maybeSingle();
   if(error)return reply(503,{error:"No se verificó el usuario."});
   if(!target)return reply(404,{error:"El usuario no pertenece al equipo."});
   if(target.role==="owner")return reply(409,{error:"La cuenta propietaria está protegida."});
   const {error:revokeError}=await client.from("TourAdministrator").delete().eq("user_id",id).eq("role","editor");
   if(revokeError)return reply(503,{error:"No se pudo revocar el acceso."});
   const {error:deleteError}=await client.auth.admin.deleteUser(id,true);
   if(deleteError)return reply(503,{error:"Acceso revocado; no se pudo completar la eliminación de la cuenta."});
   return reply(200,{deleted:true});
  }
  return reply(400,{error:"Acción inválida."});
 }catch{return reply(500,{error:"No se pudo completar la operación."});}
});

