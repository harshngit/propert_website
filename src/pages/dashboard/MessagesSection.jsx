import React, { useEffect, useRef, useState } from "react";
import { apiRequest } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { Card, LoadState, Notice, SectionHeader, formatDate, linkButton, primaryButton, useLoad } from "./ui";

// Messages (Module 36): one conversation per enquiry with the lister and
// your A R Buildwel representative, who is always part of it. Phone numbers,
// emails and links cannot be sent - the representative connects you.

const PARTY_TONE = { enquirer: "bg-[#EFF6FF] text-[#1D4ED8]", lister: "bg-[#FFFBEB] text-[#B45309]", representative: "bg-[#ECFDF5] text-[#047857]", staff: "bg-[#ECFDF5] text-[#047857]" };
const time = (v) => new Date(v).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

function Conversation({ threadId, onBack, onActivity }) {
  const { accessToken } = useAuth();
  const [thread, setThread] = useState(null);
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const lastId = useRef(0);
  const bottom = useRef(null);
  const call = (path, opt = {}) => apiRequest(path, { token: accessToken, ...opt }).then((r) => r.data);

  useEffect(() => {
    let live = true;
    lastId.current = 0;
    Promise.all([call(`/chat/threads/${threadId}`), call(`/chat/threads/${threadId}/messages`)])
      .then(([t, m]) => {
        if (!live) return;
        setThread(t);
        setItems(m.items);
        lastId.current = m.items.at(-1)?.id || 0;
        call(`/chat/threads/${threadId}/read`, { method: "POST" }).then(onActivity).catch(() => {});
      })
      .catch((err) => live && setError(err.message));
    const poll = setInterval(() => {
      if (document.hidden) return;
      call(`/chat/threads/${threadId}/messages?after=${lastId.current}`)
        .then((m) => {
          if (!live || !m.items.length) return;
          lastId.current = m.items.at(-1).id;
          setItems((cur) => [...cur, ...m.items.filter((x) => !cur.some((c) => c.id === x.id))]);
          call(`/chat/threads/${threadId}/read`, { method: "POST" }).catch(() => {});
        })
        .catch(() => {});
    }, 5000);
    return () => { live = false; clearInterval(poll); };
  }, [threadId, accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { bottom.current?.scrollIntoView({ block: "nearest" }); }, [items.length]);

  const send = async () => {
    const body = text.trim();
    if (!body) return;
    setBusy(true);
    setError(null);
    try {
      const m = await call(`/chat/threads/${threadId}/messages`, { method: "POST", body: { body } });
      setItems((cur) => [...cur, m]);
      lastId.current = m.id;
      setText("");
      onActivity();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!thread) return error ? <Notice tone="red">{error}</Notice> : <LoadState loading />;
  return (
    <Card className="!p-0">
      <div className="border-b border-[#F3F4F6] p-4">
        <button type="button" className={linkButton} onClick={onBack}>← All conversations</button>
        <h2 className="mt-1 font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#111827]" data-no-translate>{thread.subject}</h2>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {thread.participants.map((p) => (
            <span key={p.userId} className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${PARTY_TONE[p.party]}`} data-no-translate>{p.isMe ? "You" : p.name} · {p.partyLabel}{p.platformNumber ? ` · ${p.platformNumber}` : ""}</span>
          ))}
        </div>
      </div>
      <div className="max-h-[52vh] min-h-[240px] space-y-3 overflow-y-auto bg-[#FAFAFA] p-4">
        {items.length === 0 && <p className="py-10 text-center text-[14px] text-[#6B7280]">No messages yet. Ask your question here.</p>}
        {items.map((m) => m.kind === "system" ? (
          <p key={m.id} className="text-center text-[11px] text-[#6B7280]">{m.body}</p>
        ) : (
          <div key={m.id} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-[16px] px-3.5 py-2 text-[14px] ${m.mine ? "bg-[#E51C23] text-white" : "border border-[#E5E7EB] bg-white text-[#111827]"}`}>
              {!m.mine && <p className="mb-0.5 text-[11px] font-bold text-[#6B7280]" data-no-translate>{m.senderName} · {m.partyLabel}</p>}
              <p className="whitespace-pre-wrap break-words" data-no-translate>{m.body}</p>
              <p className={`mt-1 text-right text-[10px] ${m.mine ? "text-white/70" : "text-[#9CA3AF]"}`} data-no-translate>{formatDate(m.at)} {time(m.at)}</p>
            </div>
          </div>
        ))}
        <div ref={bottom} />
      </div>
      <div className="border-t border-[#F3F4F6] p-3">
        {error && <div className="mb-2"><Notice tone="red">{error}</Notice></div>}
        {thread.status === "open" ? (
          <>
            <div className="flex items-end gap-2">
              <textarea aria-label="Message" rows={2} placeholder="Write a message" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} className="min-w-0 flex-1 resize-none rounded-[12px] border border-[#E5E7EB] px-3 py-2 text-[14px]" />
              <button type="button" disabled={busy || !text.trim()} onClick={send} className={primaryButton}>Send</button>
            </div>
            <p className="mt-1.5 text-[12px] text-[#6B7280]">{thread.notice}</p>
          </>
        ) : <p className="text-center text-[13px] text-[#6B7280]">This conversation is closed.</p>}
      </div>
    </Card>
  );
}

export default function MessagesSection() {
  const { accessToken } = useAuth();
  const threads = useLoad((token) => apiRequest("/chat/threads", { token }).then((r) => r.data));
  const startable = useLoad((token) => apiRequest("/chat/startable", { token }).then((r) => r.data));
  const [active, setActive] = useState(null);
  const [error, setError] = useState(null);
  const start = async (leadId) => {
    setError(null);
    try {
      const t = (await apiRequest("/chat/threads", { method: "POST", token: accessToken, body: { leadId } })).data;
      setActive(t.id);
      threads.reload();
      startable.reload();
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="space-y-5">
      <SectionHeader title="Messages" subtitle="Talk to the lister and your A R Buildwel representative about an enquiry. Everything stays on the platform." />
      {error && <Notice tone="red">{error}</Notice>}
      {active ? <Conversation key={active} threadId={active} onBack={() => { setActive(null); threads.reload(); }} onActivity={threads.reload} /> : threads.loading || threads.error ? <LoadState loading={threads.loading} error={threads.error} onRetry={threads.reload} /> : (
        <>
          <Card className="!p-0">
            {threads.data.length === 0 ? <p className="p-5 text-[14px] text-[#6B7280]">No conversations yet.</p> : (
              <ul className="divide-y divide-[#F3F4F6]">
                {threads.data.map((t) => (
                  <li key={t.id}>
                    <button type="button" onClick={() => setActive(t.id)} className="flex w-full items-center gap-3 p-4 text-left hover:bg-[#FAFAFA]">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-semibold text-[#111827]" data-no-translate>{t.subject}</span>
                        <span className="block truncate text-[13px] text-[#6B7280]" data-no-translate>{t.last ? `${t.last.mine ? "You: " : ""}${t.last.body}` : "No messages yet"}</span>
                      </span>
                      {t.unread > 0 && <span className="rounded-full bg-[#E51C23] px-2 py-0.5 text-[11px] font-bold text-white">{t.unread}</span>}
                      <span className="shrink-0 text-[12px] text-[#9CA3AF]" data-no-translate>{t.lastMessageAt ? formatDate(t.lastMessageAt) : ""}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          {(startable.data || []).length > 0 && (
            <Card>
              <h2 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#111827]">Start a conversation</h2>
              <p className="mt-1 text-[13px] text-[#6B7280]">About one of your enquiries:</p>
              <ul className="mt-2 divide-y divide-[#F3F4F6]">
                {startable.data.slice(0, 12).map((s) => (
                  <li key={s.leadId} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="min-w-0 truncate text-[14px] text-[#111827]" data-no-translate>{s.subject}</span>
                    <button type="button" className={linkButton} onClick={() => start(s.leadId)}>Message</button>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
