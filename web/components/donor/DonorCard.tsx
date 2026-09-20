import { MapPin, Phone, BadgeCheck } from "lucide-react";
import type { Donor } from "@/lib/types";
import { daysAgoLabel, isEligible, daysUntilEligible } from "@/lib/date-helpers";

export default function DonorCard({ donor }: { donor: Donor }) {
  const eligible = isEligible(donor.lastDonationDate);
  const available = donor.isAvailable && eligible;
  const waitDays = daysUntilEligible(donor.lastDonationDate);

  return (
    <div className="rounded-2xl border border-line bg-paper-raised p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-display font-bold text-lg text-ink">{donor.name}</h3>
            {donor.verified && (
              <BadgeCheck className="w-4 h-4 text-living-green shrink-0" aria-label="যাচাইকৃত" />
            )}
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-ink-soft text-[14px]">
            <MapPin className="w-3.5 h-3.5" />
            {donor.upazila}, {donor.district}
          </p>
        </div>
        <span className="font-mono-data font-bold text-lg text-crimson bg-crimson/10 rounded-lg px-3 py-1.5">
          {donor.bloodGroup}
        </span>
      </div>

      <div className="flex items-center justify-between text-[14px]">
        <span
          className={`inline-flex items-center gap-1.5 font-medium ${
            available ? "text-living-green" : "text-ink-soft"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${available ? "bg-living-green" : "bg-ink-soft/40"}`}
          />
          {available ? "এখন উপলব্ধ" : waitDays > 0 ? `আরও ${waitDays} দিন পর উপলব্ধ` : "অনুপলব্ধ"}
        </span>
        <span className="text-ink-soft font-mono-data text-[13px]">
          {daysAgoLabel(donor.lastDonationDate)}
        </span>
      </div>

      {donor.phone ? (
        <a
          href={`tel:${donor.phone}`}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-full text-[14px] font-semibold py-2.5 transition-colors bg-ink text-paper-raised hover:bg-crimson-deep"
        >
          <Phone className="w-4 h-4" />
          {donor.phone}
        </a>
      ) : (
        <p className="mt-1 text-center text-[13px] text-ink-soft">নম্বর পাওয়া যায়নি</p>
      )}
    </div>
  );
}
