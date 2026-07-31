import type { HomenajeContent } from "@/lib/views/schemas";
import {
  CardBody,
  CardHead,
  Eyebrow,
  PhotoPanel,
  PullQuote,
  QrStrip,
  SigBadge,
  SigCard,
} from "@/components/signage/primitives";
import { T } from "@/components/signage/scale";
import { VerticalPager } from "@/components/signage/VerticalPager";

function splitMessage(text: string, maxLength = 330): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const pages: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxLength && current) {
      pages.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) pages.push(current);
  return pages;
}

/** Plantilla reusable para efemérides, homenajes y saludos de una autoridad. */
export function HomenajeView({ content }: { content: HomenajeContent }) {
  const messagePages = splitMessage(content.message);

  return (
    <>
      <PhotoPanel
        span={7}
        media={content.media}
        eyebrow={content.occasion}
        title={content.title}
        sub={[content.name, content.authority].filter(Boolean).join(" · ")}
        badge={<SigBadge kind="live">{content.badge}</SigBadge>}
      />

      <SigCard span={5} center>
        <CardHead eyebrow={content.occasion} title={content.title} />
        <CardBody className="justify-center px-[42px] py-[34px]">
          {content.quote && (
            <div className="mb-7">
              <PullQuote size={content.quote.length > 150 ? 22 : 27}>
                {content.quote}
              </PullQuote>
            </div>
          )}
          {messagePages.length > 0 && (
            <VerticalPager
              pageSize={1}
              seconds={10}
              items={messagePages.map((page, index) => (
                <p
                  key={`${index}-${page.slice(0, 24)}`}
                  className="break-words leading-[1.42] text-sig-text-soft"
                  style={{ fontSize: page.length > 270 ? 23 : T.body }}
                >
                  {page}
                </p>
              ))}
            />
          )}
          {(content.name || content.authority) && (
            <div className="mt-8 border-t border-sig-rule pt-5">
              {content.name && <Eyebrow>{content.name}</Eyebrow>}
              <p className="mt-1 text-[20px] font-semibold text-sig-ink">
                {content.authority}
              </p>
            </div>
          )}
        </CardBody>
        {content.qrCaption && <QrStrip label={content.qrCaption} url={content.qrUrl} />}
      </SigCard>
    </>
  );
}
