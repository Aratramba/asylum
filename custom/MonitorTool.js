import { WiUmbrella } from "react-icons/wi";
import styles from "./MonitorTool.module.css";

import React, { useEffect, useState } from "react";

function formatBytes(a, b = 2) {
  if (0 === a) return "0 Bytes";
  const c = 0 > b ? 0 : b,
    d = Math.floor(Math.log(a) / Math.log(1024));
  return (
    parseFloat((a / Math.pow(1024, d)).toFixed(c)) +
    " " +
    ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
  );
}

export const Bar = ({ value, total, unit }) => (
  <div
    className={[
      styles.bar,
      (100 / total) * value >= 50 && total !== 0 ? styles.barHalf : null,
      (100 / total) * value >= 75 && total !== 0 ? styles.barTwoThirds : null,
    ].join(" ")}
  >
    <div
      className={styles.barValue}
      style={{ width: `${(100 / total) * value}%` }}
    >
      <span className={styles.barValueLabel}>
        {unit === "byte" ? formatBytes(value) : value.toLocaleString()} /{" "}
        {unit === "byte" ? formatBytes(total) : total.toLocaleString()}
      </span>
    </div>
  </div>
);

export const Monitor = () => {
  const [resources, setResources] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (stats) return;

    fetch(`https://api.sanity.io/v1/resources/snapshot/z9m82x1g`, {
      credentials: "include",
      headers: {
        Cookie: `sanitySession=${process.env.SANITY_STUDIO_API_TOKEN}`,
      },
    })
      .then((x) => x.json())
      .then((data) => setResources(data));
  }, []);

  useEffect(() => {
    fetch(`https://z9m82x1g.api.sanity.io/v1/data/stats/production`)
      .then((x) => x.json())
      .then((data) => setStats(data));
  }, []);

  return (
    <div>
      {resources && (
        <ul className={styles.barChart}>
          <li>
            apiRequests:
            <Bar
              value={resources.usage.apiRequests}
              total={resources.quota.apiRequests}
            />
          </li>
          <li>
            apiCdnRequests:
            <Bar
              value={resources.usage.apiCdnRequests}
              total={resources.quota.apiCdnRequests}
            />
          </li>
          <li>
            documents:
            <Bar
              value={resources.usage.documents}
              total={resources.quota.documents}
            />
          </li>
          <li>
            assets:
            <Bar
              value={resources.usage.assets}
              total={resources.quota.assets}
              unit="byte"
            />
          </li>
          <li>
            bandwidth:
            <Bar
              value={resources.usage.bandwidth}
              total={resources.quota.bandwidth}
              unit="byte"
            />
          </li>
          <li>
            users:
            <Bar value={resources.usage.users} total={resources.quota.users} />
          </li>
          <li>
            datasets:
            <Bar
              value={resources.usage.datasets}
              total={resources.quota.datasets}
            />
          </li>
        </ul>
      )}

      {stats && (
        <ul className={styles.barChart}>
          <li>
            documents count:
            <Bar
              value={stats.documents.count.value}
              total={stats.documents.count.limit}
            />
          </li>
          <li>
            documents sizeSum:
            <Bar
              value={stats.documents.sizeSum.value}
              total={stats.documents.sizeSum.limit}
              unit="byte"
            />
          </li>
          <li>
            documents jsonSizeSum:
            <Bar
              value={stats.documents.jsonSizeSum.value}
              total={stats.documents.jsonSizeSum.limit}
              unit="byte"
            />
          </li>
          <li>
            fields:
            <Bar
              value={stats.fields.count.value}
              total={stats.fields.count.limit}
            />
          </li>
          <li>
            types:
            <Bar
              value={stats.types.count.value}
              total={stats.types.count.limit}
            />
          </li>
        </ul>
      )}
    </div>
  );
};

export default {
  title: "Monitor",
  name: "monitor",
  icon: () => {
    useEffect(() => {
      console.log("monitoring");
    }, []);
    return WiUmbrella;
  },
  component: Monitor,
};
