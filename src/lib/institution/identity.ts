/**
 * Identidad institucional que se pinta en la cabecera y el pie de TODAS las
 * pantallas: logos, nombre de la institución, contactos, redes y rótulo.
 *
 * Este módulo es compartido a propósito (sin `server-only`): el reproductor,
 * que es un componente de cliente, necesita el tipo y los valores por defecto.
 * La LECTURA desde la base de datos vive en `lib/data/institution.ts`.
 */
export interface InstitutionIdentity {
  universityName: string;
  vicerrectorateName: string;
  /** URL firmada del logo, o `null` si no se ha subido ninguno. */
  logoPrimaryUrl: string | null;
  logoSecondaryUrl: string | null;
  logoPrimaryPath: string | null;
  logoSecondaryPath: string | null;
  phones: string[];
  email: string;
  location: string;
  social: string[];
  tickerLabel: string;
  tickerText: string;
}

export const DEFAULT_IDENTITY: InstitutionIdentity = {
  universityName: 'Universidad Autónoma del Beni "José Ballivián"',
  vicerrectorateName: "Vicerrectorado de Posgrado",
  logoPrimaryUrl: null,
  logoSecondaryUrl: null,
  logoPrimaryPath: null,
  logoSecondaryPath: null,
  phones: ["61948267", "72814772"],
  email: "escuelaposgrado@uabjb.edu.bo",
  location: "Zona Virgen de Loreto, Trinidad",
  social: ["Facebook", "Instagram", "YouTube"],
  tickerLabel: "Posgrado UABJB",
  tickerText:
    "Formar posgraduados con pertinencia amazónica es nuestro compromiso.",
};
