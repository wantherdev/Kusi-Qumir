import { Transform } from 'class-transformer';
import {
  Equals,
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

const trim = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreateContactRequestDto {
  @Transform(trim)
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @Transform(trim)
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MinLength(7)
  @MaxLength(30)
  phone?: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(20)
  approximateDate?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  travelers?: number;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  interest?: string;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string;

  @IsBoolean()
  @Equals(true)
  privacyAccepted!: true;
}

export class CreateClaimDto {
  @IsIn(['CLAIM', 'COMPLAINT'])
  type!: 'CLAIM' | 'COMPLAINT';

  @Transform(trim)
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  consumerName!: string;

  @IsBoolean()
  isMinor!: boolean;

  @ValidateIf((request: CreateClaimDto) => request.isMinor)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  guardianName?: string;

  @Transform(trim)
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  identityDocument!: string;

  @Transform(trim)
  @IsString()
  @MinLength(5)
  @MaxLength(300)
  address!: string;

  @Transform(trim)
  @IsString()
  @MinLength(7)
  @MaxLength(30)
  phone!: string;

  @Transform(trim)
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @Transform(trim)
  @IsString()
  @MinLength(3)
  @MaxLength(300)
  service!: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(9999999999.99)
  claimedAmount?: number;

  @Transform(trim)
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  detail!: string;

  @Transform(trim)
  @IsString()
  @MinLength(5)
  @MaxLength(3000)
  request!: string;

  @IsBoolean()
  @Equals(true)
  privacyAccepted!: true;
}
