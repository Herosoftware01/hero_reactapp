import React, { useEffect, useMemo, useState } from "react";

/* =================== API =================== */
const API_BASE = "http://127.0.0.1:8000";
const LIST_ENDPOINT = `${API_BASE}/grid_api_11/`;

/* =================== UTILS =================== */
const normStr = (v: string | null | undefined) =>
  String(v ?? "").replace(/[\u200B-\u200D\uFEFF]/g, "").trim().toUpperCase();

/* =================== TYPES =================== */
interface Detail {
  jobno: string;
  top_bottom: string;
  print_type: string;
  print_description: string;
  punit_sh: string;
  color_combination: string;
  inside_outside: string;
  rgb: string;
  print_screen_1?: string;
  print_screen_2?: string;
  print_screen_3?: string;
  print_image?: string;
}

interface Card {
  id: number;
  title: string;
  desc: string;
  meta: {
    unit: string;
    combo: string;
    inside_outside: string;
    rgb: string;
    screens: string[];
    image?: string;
  };
}

interface Order {
  id: number;
  jobno: string;
  director?: string;
  quality_controller: string;
  abc: string;
  Printing: string;
  Emb?: string;
  order_follow_up: string;
  final_year: string;
  final_delivery_date: string;
  details?: Detail[];
}

/* =================== IMAGE =================== */
function GridImage({ src, size = 36 }: { src?: string; size?: number }) {
  const [ok, setOk] = useState(true);
  useEffect(() => setOk(true), [src]);

  if (!src || !ok)
    return (
      <div
        className="bg-slate-200 rounded flex items-center justify-center text-[10px]"
        style={{ width: size, height: size }}
      >
        No Image
      </div>
    );

  return (
    <img
      src={src}
      style={{ width: size, height: size }}
      className="object-cover rounded"
      loading="lazy"
      onError={() => setOk(false)}
      alt=""
    />
  );
}

/* =================== CHEVRON =================== */
function Chevron({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-7 h-7 flex items-center justify-center hover:bg-slate-200 rounded"
    >
      <svg
        className={`transition-transform ${open ? "rotate-90" : ""}`}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  );
}

/* =================== DETAILS → BOARD =================== */
function detailsToBoard(details: Detail[] = []): {
  todo: Card[];
  inProgress: Card[];
  done: Card[];
} {
  const groups: { TOP: Card[]; BOTTOM: Card[]; OTHER: Card[] } = {
    TOP: [],
    BOTTOM: [],
    OTHER: [],
  };

  details.forEach((d, i) => {
    const bucket =
      normStr(d.top_bottom) === "TOP"
        ? "TOP"
        : normStr(d.top_bottom) === "BOTTOM"
        ? "BOTTOM"
        : "OTHER";

    const screens = [d.print_screen_1, d.print_screen_2, d.print_screen_3].filter(
      (s): s is string => Boolean(s)
    );

    groups[bucket].push({
      id: i,
      title: `${d.jobno} / ${d.print_type}`,
      desc: d.print_description,
      meta: {
        unit: d.punit_sh,
        combo: d.color_combination,
        inside_outside: d.inside_outside,
        rgb: d.rgb,
        screens,
        image: d.print_image,
      },
    });
  });

  return {
    todo: groups.TOP,
    inProgress: groups.BOTTOM,
    done: groups.OTHER,
  };
}

/* =================== TASKBOARD =================== */
function Taskboard({ board }: { board: { todo: Card[]; inProgress: Card[]; done: Card[] } }) {
  const cols = [
    { key: "todo" as const, title: "TOP" },
    { key: "inProgress" as const, title: "BOTTOM" },
    { key: "done" as const, title: "OTHER" },
  ];

  return (
    <div className="p-3">
      <div className="grid md:grid-cols-3 gap-3">
        {cols.map((c) => (
          <div
            key={c.key}
            className="bg-slate-50 rounded ring-1 ring-slate-200"
          >
            <div className="sticky top-0 bg-slate-50 px-3 py-2 font-semibold border-b">
              {c.title} ({board[c.key].length})
            </div>

            <div className="p-2">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {board[c.key].map((card) => (
                  <div
                    key={card.id}
                    className="min-w-[280px] max-w-[320px] bg-white p-2 rounded ring-1 ring-slate-200"
                  >
                    <div className="font-semibold text-sm">{card.title}</div>
                    <div className="text-xs mt-1">{card.desc}</div>

                    <div className="flex flex-wrap gap-2 mt-2 text-xs">
                      <span className="bg-indigo-100 px-2 rounded">
                        Unit {card.meta.unit}
                      </span>
                      <span className="bg-pink-100 px-2 rounded">
                        Combo {card.meta.combo}
                      </span>
                      <span className="bg-amber-100 px-2 rounded">
                        {card.meta.inside_outside}
                      </span>
                    </div>

                    {card.meta.screens.length > 0 && (
                      <ul className="text-xs mt-2 list-disc ml-4">
                        {card.meta.screens.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    )}

                    {card.meta.image && (
                      <img
                        src={card.meta.image}
                        className="mt-2 rounded max-w-[160px]"
                        alt="Print"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =================== DETAIL PANEL =================== */
function DetailPanel({ order }: { order: Order }) {
  const board = useMemo(
    () => detailsToBoard(order.details || []),
    [order.details]
  );

  return (
    <div className="bg-white rounded ring-1 ring-slate-200">
      <div className="p-3 font-semibold text-sm">
        Job No: {order.jobno}
      </div>
      <Taskboard board={board} />
    </div>
  );
}

/* =================== FETCH =================== */
async function fetchOrders(): Promise<Order[]> {
  const r = await fetch(LIST_ENDPOINT);
  const j = await r.json();
  return j;
}

/* =================== MAIN GRID =================== */
export default function OrdersGridWithDetails() {
  const [rows, setRows] = useState<Order[]>([]);
  const [open, setOpen] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchOrders().then(setRows).catch(err => console.error("Fetch error:", err));
  }, []);

  const toggle = (jobno: string) => {
    const n = new Set(open);
    n.has(jobno) ? n.delete(jobno) : n.add(jobno);
    setOpen(n);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow ring-1 ring-slate-200">
      {/* Header */}
      <div className="px-4 py-3 border-b">
        <div className="text-lg font-semibold">Data Grid</div>
        <div className="text-xs text-slate-500">
          Taskboard shows details[] strictly matching jobno, laid out
          horizontally.
        </div>
      </div>

      {/* Single scroll */}
      <div className="flex-1 overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-white shadow z-10">
            <tr className="text-left">
              <th className="px-2 py-2 w-8"></th>
              <th className="px-2 py-2">director</th>
              <th className="px-2 py-2">id</th>
              <th className="px-2 py-2">jobno</th>
              <th className="px-2 py-2">quality_controller</th>
              <th className="px-2 py-2">abc</th>
              <th className="px-2 py-2">Printing</th>
              <th className="px-2 py-2">Emb</th>
              <th className="px-2 py-2">order_follow_up</th>
              <th className="px-2 py-2">final_year</th>
              <th className="px-1 py-1">final_delivery_date</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <React.Fragment key={r.jobno}>
                <tr className="border-t hover:bg-slate-50">
                  <td className="px-2 py-2">
                    <Chevron
                      open={open.has(r.jobno)}
                      onClick={() => toggle(r.jobno)}
                    />
                  </td>
                  <td className="px-2 py-2">
                    <GridImage src={r.director} />
                  </td>
                  <td className="px-2 py-2">{r.id}</td>
                  <td className="px-2 py-2">{r.jobno}</td>
                  <td className="px-2 py-2">{r.quality_controller}</td>
                  <td className="px-2 py-2">{r.abc}</td>
                  <td className="px-2 py-2">{r.Printing}</td>
                  <td className="px-2 py-2">{r.Emb ?? "-"}</td>
                  <td className="px-2 py-2">{r.order_follow_up}</td>
                  <td className="px-2 py-2">{r.final_year}</td>
                  <td className="px-1 py-1">{r.final_delivery_date}</td>
                </tr>

                {open.has(r.jobno) && (
                  <tr className="bg-slate-50">
                    <td colSpan={11} className="p-3">
                      <DetailPanel order={r} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}