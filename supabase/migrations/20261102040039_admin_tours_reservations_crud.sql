-- Supabase administration: reversible deletion and private manual reservations.
ALTER TABLE public."Tour" ADD COLUMN "deletedAt" timestamptz;
ALTER TABLE public."Tour" ADD CONSTRAINT "Tour_deleted_is_inactive" CHECK ("deletedAt" IS NULL OR active = false);
ALTER TABLE public."Tour" ALTER COLUMN "updatedAt" SET DEFAULT now();
ALTER POLICY "public_read_active_tours" ON public."Tour" USING (active = true AND "deletedAt" IS NULL);
GRANT UPDATE ("slug","code","title","subtitle","shortDescription","description","durationHours","durationDays","difficulty","groupType","serviceType","operationType","featured","categorySlug","recommendedFor","prices","itineraryDays","includes","excludes","faqs","recommendations","requirements","images","seo","destinations","deletedAt","active","updatedAt") ON public."Tour" TO authenticated;
CREATE INDEX "Tour_admin_catalog_idx" ON public."Tour" ("createdAt" DESC) WHERE "deletedAt" IS NULL;

CREATE TABLE public."Reservation" (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 code text NOT NULL UNIQUE DEFAULT ('KQ-R-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
 "tourId" text NOT NULL REFERENCES public."Tour"(id) ON DELETE RESTRICT,
 "tourTitle" text NOT NULL,
 "customerName" text NOT NULL CHECK (char_length(btrim("customerName")) BETWEEN 2 AND 150),
 "customerPhone" text NOT NULL CHECK (char_length(btrim("customerPhone")) BETWEEN 3 AND 40),
 "customerEmail" text CHECK ("customerEmail" IS NULL OR char_length("customerEmail") <= 254),
 "travelDate" date NOT NULL,
 passengers integer NOT NULL CHECK (passengers BETWEEN 1 AND 100),
 currency text NOT NULL DEFAULT 'PEN' CHECK (currency = 'PEN'),
 "totalAmount" numeric(12,2) NOT NULL CHECK ("totalAmount" BETWEEN 0 AND 99999999.99),
 "paidAmount" numeric(12,2) NOT NULL DEFAULT 0 CHECK ("paidAmount" >= 0 AND "paidAmount" <= "totalAmount"),
 status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','CONFIRMED','COMPLETED','CANCELLED')),
 notes text NOT NULL DEFAULT '' CHECK (char_length(notes) <= 4000),
 "createdBy" uuid REFERENCES auth.users(id) ON DELETE SET NULL,
 "createdAt" timestamptz NOT NULL DEFAULT now(),
 "updatedAt" timestamptz NOT NULL DEFAULT now(),
 "deletedAt" timestamptz
);
ALTER TABLE public."Reservation" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public."Reservation" FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public."Reservation" TO authenticated;
GRANT INSERT ("tourId","customerName","customerPhone","customerEmail","travelDate",passengers,"totalAmount","paidAmount",status,notes) ON public."Reservation" TO authenticated;
GRANT UPDATE ("tourId","customerName","customerPhone","customerEmail","travelDate",passengers,"totalAmount","paidAmount",status,notes,"deletedAt") ON public."Reservation" TO authenticated;
CREATE POLICY "administrators_read_reservations" ON public."Reservation" FOR SELECT TO authenticated
 USING (EXISTS (SELECT 1 FROM public."TourAdministrator" WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "administrators_create_reservations" ON public."Reservation" FOR INSERT TO authenticated
 WITH CHECK ("createdBy" = (SELECT auth.uid()) AND "deletedAt" IS NULL AND EXISTS (SELECT 1 FROM public."TourAdministrator" WHERE user_id = (SELECT auth.uid())));
CREATE POLICY "administrators_update_reservations" ON public."Reservation" FOR UPDATE TO authenticated
 USING (EXISTS (SELECT 1 FROM public."TourAdministrator" WHERE user_id = (SELECT auth.uid())))
 WITH CHECK (EXISTS (SELECT 1 FROM public."TourAdministrator" WHERE user_id = (SELECT auth.uid())));
CREATE INDEX "Reservation_tour_idx" ON public."Reservation" ("tourId");
CREATE INDEX "Reservation_creator_idx" ON public."Reservation" ("createdBy");
CREATE INDEX "Reservation_created_idx" ON public."Reservation" ("createdAt" DESC);
CREATE INDEX "Reservation_live_date_idx" ON public."Reservation" ("travelDate",status) WHERE "deletedAt" IS NULL;

CREATE FUNCTION public.touch_admin_record() RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN NEW."updatedAt" := clock_timestamp(); RETURN NEW; END;
$$;
REVOKE ALL ON FUNCTION public.touch_admin_record() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER "Tour_touch_updated" BEFORE UPDATE ON public."Tour" FOR EACH ROW EXECUTE FUNCTION public.touch_admin_record();
CREATE TRIGGER "Reservation_touch_updated" BEFORE UPDATE ON public."Reservation" FOR EACH ROW EXECUTE FUNCTION public.touch_admin_record();

CREATE FUNCTION public.prepare_reservation() RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
 IF TG_OP = 'INSERT' THEN NEW."createdBy" := auth.uid(); END IF;
 IF TG_OP = 'INSERT' OR NEW."tourId" IS DISTINCT FROM OLD."tourId" THEN
  SELECT title INTO NEW."tourTitle" FROM public."Tour" WHERE id=NEW."tourId" AND "deletedAt" IS NULL;
  IF NOT FOUND THEN RAISE EXCEPTION 'Selected tour unavailable' USING ERRCODE='23503'; END IF;
 END IF;
 RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.prepare_reservation() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER "Reservation_prepare" BEFORE INSERT OR UPDATE ON public."Reservation" FOR EACH ROW EXECUTE FUNCTION public.prepare_reservation();
COMMENT ON TABLE public."Reservation" IS 'Private manual reservations. Administrator membership required. No public booking or payment processing.';
