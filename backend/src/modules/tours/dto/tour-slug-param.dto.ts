import { IsString, Matches, MaxLength } from 'class-validator';

export class TourSlugParamDto {
  @IsString()
  @MaxLength(200)
  @Matches(/^[a-z0-9-]+$/, { message: 'slug inválido' })
  slug!: string;
}
