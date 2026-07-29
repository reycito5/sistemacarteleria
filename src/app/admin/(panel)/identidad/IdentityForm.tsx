"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Building2, Save, Type } from "lucide-react";
import type { InstitutionIdentity } from "@/lib/institution/identity";
import { saveInstitutionIdentity } from "@/lib/actions/institution";
import { ScreenFrame } from "@/components/institutional/ScreenFrame";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { LogoUploader } from "./LogoUploader";

/**
 * Edición de la identidad institucional, con vista previa en vivo de la
 * cabecera y el pie tal como se verán en los cuatro televisores.
 */
export function IdentityForm({ identity }: { identity: InstitutionIdentity }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    universityName: identity.universityName,
    vicerrectorateName: identity.vicerrectorateName,
    phones: identity.phones.join(", "),
    email: identity.email,
    location: identity.location,
    social: identity.social.join(", "),
    tickerLabel: identity.tickerLabel,
    tickerText: identity.tickerText,
  });
  const [logoPrimary, setLogoPrimary] = useState(identity.logoPrimaryPath);
  const [logoSecondary, setLogoSecondary] = useState(identity.logoSecondaryPath);

  const set = (key: keyof typeof form, value: string) => {
    setSaved(false);
    setForm((f) => ({ ...f, [key]: value }));
  };

  const splitList = (value: string) =>
    value
      .split(/[,·]/)
      .map((v) => v.trim())
      .filter(Boolean);

  /** Identidad tal como quedará: alimenta la vista previa sin guardar nada. */
  const previewIdentity: InstitutionIdentity = {
    ...identity,
    universityName: form.universityName,
    vicerrectorateName: form.vicerrectorateName,
    phones: splitList(form.phones),
    email: form.email,
    location: form.location,
    social: splitList(form.social),
    tickerLabel: form.tickerLabel,
    tickerText: form.tickerText,
    logoPrimaryPath: logoPrimary,
    logoSecondaryPath: logoSecondary,
    // Si se quitó el logo, la vista previa debe dejar de mostrarlo.
    logoPrimaryUrl: logoPrimary ? identity.logoPrimaryUrl : null,
    logoSecondaryUrl: logoSecondary ? identity.logoSecondaryUrl : null,
  };

  const submit = () => {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const res = await saveInstitutionIdentity({
        universityName: form.universityName,
        vicerrectorateName: form.vicerrectorateName,
        phones: splitList(form.phones),
        email: form.email,
        location: form.location,
        social: splitList(form.social),
        tickerLabel: form.tickerLabel,
        tickerText: form.tickerText,
        logoPrimaryPath: logoPrimary,
        logoSecondaryPath: logoSecondary,
      });
      if (!res.ok) setError(res.error);
      else {
        setSaved(true);
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Vista previa */}
      <Card>
        <CardHeader
          icon={<Building2 size={18} />}
          title="Así se verá en los televisores"
          description="Cabecera, rótulo y pie son comunes a todas las plantillas."
        />
        <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-[12px] border border-ui-border bg-black">
          <ScreenFrame identity={previewIdentity}>
            <div className="col-span-12 grid place-items-center rounded-[2px] border border-dashed border-sig-rule bg-sig-card">
              <p className="font-serif text-[26px] font-semibold text-sig-text-faint">
                Aquí va el contenido de cada plantilla
              </p>
            </div>
          </ScreenFrame>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Logos e identidad */}
        <Card>
          <CardHeader
            icon={<Building2 size={18} />}
            title="Logos e identidad"
            description="Los logos van sobre el bloque azul de la cabecera."
          />
          <div className="mt-5 space-y-6">
            <LogoUploader
              label="Logo principal"
              hint="Escudo de la universidad. PNG o SVG con fondo transparente."
              currentUrl={identity.logoPrimaryUrl}
              value={logoPrimary}
              onChange={(p) => {
                setSaved(false);
                setLogoPrimary(p);
              }}
            />
            <LogoUploader
              label="Logo secundario"
              hint="Marca del Vicerrectorado. Si no se sube, se muestra el texto «Posgrado UABJB»."
              currentUrl={identity.logoSecondaryUrl}
              value={logoSecondary}
              onChange={(p) => {
                setSaved(false);
                setLogoSecondary(p);
              }}
            />

            <Field label="Universidad" htmlFor="id-university" required>
              <Input
                id="id-university"
                value={form.universityName}
                onChange={(e) => set("universityName", e.target.value)}
              />
            </Field>
            <Field label="Vicerrectorado" htmlFor="id-vice" required>
              <Input
                id="id-vice"
                value={form.vicerrectorateName}
                onChange={(e) => set("vicerrectorateName", e.target.value)}
              />
            </Field>
          </div>
        </Card>

        {/* Pie y rótulo */}
        <Card>
          <CardHeader
            icon={<Type size={18} />}
            title="Pie y rótulo"
            description="Contactos y frase institucional del borde inferior."
          />
          <div className="mt-5 space-y-5">
            <Field
              label="Teléfonos"
              htmlFor="id-phones"
              hint="Sepárelos con comas."
            >
              <Input
                id="id-phones"
                value={form.phones}
                onChange={(e) => set("phones", e.target.value)}
              />
            </Field>
            <Field label="Correo" htmlFor="id-email">
              <Input
                id="id-email"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </Field>
            <Field label="Ubicación" htmlFor="id-location">
              <Input
                id="id-location"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
              />
            </Field>
            <Field
              label="Redes sociales"
              htmlFor="id-social"
              hint="Sepárelas con comas."
            >
              <Input
                id="id-social"
                value={form.social}
                onChange={(e) => set("social", e.target.value)}
              />
            </Field>
            <Field
              label="Etiqueta del rótulo"
              htmlFor="id-ticker-label"
              hint="El recuadro rojo del rótulo inferior."
            >
              <Input
                id="id-ticker-label"
                value={form.tickerLabel}
                onChange={(e) => set("tickerLabel", e.target.value)}
              />
            </Field>
            <Field label="Frase del rótulo" htmlFor="id-ticker">
              <Textarea
                id="id-ticker"
                rows={2}
                value={form.tickerText}
                onChange={(e) => set("tickerText", e.target.value)}
              />
            </Field>
          </div>
        </Card>
      </div>

      {error && (
        <Alert tone="danger" title="No se pudo guardar">
          {error}
        </Alert>
      )}
      {saved && (
        <Alert tone="ok" title="Identidad actualizada">
          Los televisores la recogerán en menos de un minuto.
        </Alert>
      )}

      <Button onClick={submit} disabled={pending} size="lg">
        <Save size={17} aria-hidden />
        {pending ? "Guardando…" : "Guardar identidad"}
      </Button>
    </div>
  );
}
