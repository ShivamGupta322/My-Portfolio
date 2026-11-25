"use client";

import type { ReactNode } from "react";
import { Lock, PhoneIncoming } from "lucide-react";
import {
  Avatar,
  Badge,
  Bar,
  Check,
  Collapse,
  Count,
  Facepile,
  Row,
  Spinner,
  Stage,
  States,
  Text,
  type Act,
  type LookTokens,
} from "./kit";
import "./backend-scenes.css";

/*
 * Faux product scenes for the backend project cards, built with the Stageshow
 * kit (.agents/skills/stageshow). The grid already shows two browser windows,
 * so these are single components with no window chrome (references/bento.md,
 * rule 3), each telling one event:
 *   · Order processing: a worker crashes, the supervisor restarts it, throughput recovers
 *   · VoIP: an incoming call is matched to a callflow, routed and answered
 *   · Nearby: a message lands in a local group, and the one fact that matters:
 *     exact locations are never stored
 * Layout: "pinned, bottom bleed" (references/framing.md): the component is
 * inset top and sides and runs off the bottom; only filler is cropped.
 * Below 390px each switches to a `compact` composition (a closer crop at
 * ~1:1) rather than scaling the wide one down.
 * Each plays once when first seen (grid tiles shouldn't loop against each
 * other); `poster` is the payoff, shown under reduced motion.
 */

const W = 400;
const H = 250;
/** Phone column: a closer crop drawn near 1:1, so no text falls under 10px. */
const COMPACT = { below: 390, width: 340, height: 212 };

/** The site's fonts, Midnight Aurora surfaces and cyan accent inside the stage. */
const TOKENS: LookTokens = {
  "--ss-font": "var(--font-sans), system-ui, sans-serif",
  "--ss-accent": "#22d3ee",
  "--ss-surface": "#1a1b26",
  "--ss-raised": "#242536",
  "--ss-text": "#a1a1b5",
  "--ss-text-strong": "#f4f4f8",
  // the kit's dark faint ink is too dim on this surface for 12px labels
  "--ss-text-faint": "#8e8ea6",
};

/* ------------------------------------------------------------------ */
/* Order processing: let it crash                                      */
/* ------------------------------------------------------------------ */

type Worker = "running" | "crashed" | "restarting" | "restarted";
type OrderS = { worker: Worker; rate: number };

async function orderScript(a: Act<OrderS>) {
  await a.wait(900);
  a.mark("crash");
  a.put({ worker: "crashed", rate: 96 });
  await a.wait(1100);
  a.put({ worker: "restarting" });
  await a.wait(1000);
  a.mark("restarted");
  a.put({ worker: "restarted", rate: 112 });
}

const STATUS: Record<Worker, { tone: "neutral" | "danger" | "warning" | "success"; label: string }> = {
  running: { tone: "neutral", label: "Running" },
  crashed: { tone: "danger", label: "Crashed" },
  restarting: { tone: "warning", label: "Restarting" },
  restarted: { tone: "success", label: "Running" },
};

export function OrderScene() {
  return (
    <Stage<OrderS>
      width={W}
      height={H}
      compact={COMPACT}
      theme="dark"
      tokens={TOKENS}
      play="once"
      initial={{ worker: "running", rate: 112 }}
      poster={{ worker: "restarted", rate: 112 }}
      script={orderScript}
      className="bk bk-order"
    >
      {(s) => (
        <div className="bk-card">
          <div className="bk-head">
            <span className="bk-id">order_worker_sup</span>
            <span className="bk-dim">one_for_one</span>
          </div>
          <div className="bk-big">
            <Count value={s.rate} duration={600} className="bk-big__n" />
            <span className="bk-big__unit">orders/s</span>
          </div>
          <div className="bk-rows">
            <WorkerRow name="worker_1" status="running" />
            <WorkerRow
              name="worker_2"
              status={s.worker}
              note={
                <States
                  align="start"
                  value={s.worker === "running" ? "none" : s.worker === "restarted" ? "ok" : "err"}
                  states={{
                    none: <span />,
                    err: <span className="bk-note bk-note--err">payment gateway timeout</span>,
                    ok: <span className="bk-note">Restarted by supervisor · 0 orders lost</span>,
                  }}
                />
              }
            />
            <div className="bk-row bk-row--filler">
              <Bar w={64} h={7} r={3.5} tone={2} />
              <Bar w={58} h={18} r={9} tone={1} />
            </div>
          </div>
        </div>
      )}
    </Stage>
  );
}

function WorkerRow({ name, status, note }: { name: string; status: Worker; note?: ReactNode }) {
  const st = STATUS[status];
  return (
    <div className="bk-row" data-lead={note ? "" : undefined}>
      <span className="bk-row__main">
        <span className="bk-id bk-id--strong">{name}</span>
        {note}
      </span>
      <Badge
        tone={st.tone}
        className="bk-badge"
        icon={
          <span className="bk-mark" data-spin={status === "restarting" || undefined}>
            <Spinner size={8} />
            <i className="bk-dot" />
          </span>
        }
      >
        <States
          align="start"
          value={st.label}
          states={{ Running: "Running", Crashed: "Crashed", Restarting: "Restarting" }}
        />
      </Badge>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* VoIP: an incoming call routed                                       */
/* ------------------------------------------------------------------ */

type CallS = { step: number; secs: number };

async function callScript(a: Act<CallS>) {
  await a.wait(800);
  a.put({ step: 1 });
  await a.wait(900);
  a.put({ step: 2 });
  await a.wait(900);
  a.mark("answered");
  a.put({ step: 3 });
  for (let t = 1; t <= 4; t++) {
    await a.wait(1000);
    a.put({ secs: t });
  }
}

const STEPS = [
  { title: "Callflow matched", sub: "Kazoo · main menu" },
  { title: "Routed to Support queue", sub: "FreeSWITCH · 2 agents free" },
  { title: "Agent answered", sub: null },
];

export function CallScene() {
  return (
    <Stage<CallS>
      width={W}
      height={H}
      compact={COMPACT}
      theme="dark"
      tokens={TOKENS}
      play="once"
      initial={{ step: 0, secs: 0 }}
      poster={{ step: 3, secs: 4 }}
      script={callScript}
      className="bk bk-call"
    >
      {(s) => (
        <div className="bk-card">
          <div className="bk-head">
            <span className="bk-call__who">
              <span className="bk-call__icon">
                <PhoneIncoming aria-hidden size={14} strokeWidth={2.2} />
              </span>
              <span>
                <span className="bk-title">Incoming call</span>
                <span className="bk-dim bk-num">+91 98••• ••210</span>
              </span>
            </span>
            <span className="bk-timer" data-on={s.step >= 3 || undefined}>
              <Count value={s.secs} format={(n) => `0:${String(Math.round(n)).padStart(2, "0")}`} duration={400} />
            </span>
          </div>
          <ol className="bk-steps">
            {STEPS.map((st, i) => (
              <li key={st.title} className="bk-step" data-on={s.step > i || undefined} data-next={s.step === i || undefined}>
                <Check on={s.step > i} pending={s.step === i} size={16} />
                <span className="bk-step__text">
                  <span className="bk-step__title">{st.title}</span>
                  {st.sub && <span className="bk-dim">{st.sub}</span>}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Stage>
  );
}

/* ------------------------------------------------------------------ */
/* Nearby: a local group chat that never keeps your coordinates        */
/* ------------------------------------------------------------------ */

type NearS = { chip: boolean; reply: boolean };

async function nearbyScript(a: Act<NearS>) {
  await a.wait(700);
  a.put({ chip: true });
  await a.wait(1100);
  a.mark("reply");
  a.put({ reply: true });
}

export function NearbyScene() {
  return (
    <Stage<NearS>
      width={W}
      height={H}
      compact={COMPACT}
      theme="dark"
      tokens={TOKENS}
      play="once"
      initial={{ chip: false, reply: false }}
      poster={{ chip: true, reply: true }}
      script={nearbyScript}
      className="bk bk-near"
    >
      {(s, _rect, layout) => (
        <>
          <div className="bk-card">
            <div className="bk-head">
              <span className="bk-title">Nearby</span>
              <span className="bk-near__here">
                <Facepile names={["Aarav Shah", "Meera Rao", "Kabir Sen"]} size={18} overlap={4} />
                <Text className="bk-dim">6 within 1 km</Text>
              </span>
            </div>
            <div className="bk-feed">
              <Row
                pad={8}
                lead={<Avatar size={24} />}
                title={<Bar w={70} h={7} r={3.5} tone={3} />}
                subtitle={<Bar w={150} h={6} r={3} tone={2} />}
              />
              <Row
                pad={8}
                lead={<Avatar name="Aarav Shah" size={24} />}
                title={<Text>Aarav</Text>}
                subtitle={<Text>Cricket at the park in 20?</Text>}
              />
              <Collapse open={s.reply} from="below">
                <Row
                  pad={8}
                  lead={<Avatar name="Meera Rao" size={24} />}
                  title={<Text>Meera</Text>}
                  subtitle={<Text>5 min away, count me in</Text>}
                />
              </Collapse>
            </div>
          </div>
          <div className="bk-chip" data-on={s.chip || undefined}>
            <Lock aria-hidden size={12} strokeWidth={2.4} />
            {/* shorter on the phone layout so the chip keeps a full gutter */}
            <Text>{layout === "compact" ? "Location never stored" : "Exact location never stored"}</Text>
          </div>
        </>
      )}
    </Stage>
  );
}
