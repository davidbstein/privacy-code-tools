import React from "react";

function countryColor(country, s, l) {
  const s_n = Math.max(Math.min(s, 100 - s), 20) * 2;
  const num = _.multiply(..._.map(country).map((c) => c.charCodeAt(0)));
  return `hsl(${num % 360}deg, ${(num % s_n) - s_n / 2 + s}%, ${l}%)`;
}

export default function PartBar({ category_pairs }) {
  return (
    <div className="part-bar">
      {_.sortBy(category_pairs, ([k, v]) => -parseFloat(v)).map(([label, percentage]) => {
        return (
          <div
            key={label}
            className={`part-bar-item`}
            style={{ width: percentage, backgroundColor: countryColor(label, 40, 50) }}
          >
            <div className="part-bar-label">{label}</div>
            <div
              className="part-bar-hover"
              style={{ color: countryColor(label, 50, 30), backgroundColor: countryColor(label, 50, 80) }}
            >
              {label}: {percentage}
            </div>
          </div>
        );
      })}
    </div>
  );
}
