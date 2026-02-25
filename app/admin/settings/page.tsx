"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface HotToursSettings {
  minPrice: number;
  maxPrice: number;
  priorityCountries: string[];
  instantConfirmOnly: boolean;
  departureDaysFrom: number;
  departureDaysTo: number;
}

interface ApiConfig {
  endpoint: string;
  agencyId: string;
  domainId: string;
  authKey: string;
  currency: string;
  hotToursSettings: HotToursSettings;
}

const DEFAULT: ApiConfig = {
  endpoint: "https://crm.tat.ua/tf/tourscanner",
  agencyId: "",
  domainId: "",
  authKey: "",
  currency: "uah",
  hotToursSettings: {
    minPrice: 0,
    maxPrice: 0,
    priorityCountries: [],
    instantConfirmOnly: false,
    departureDaysFrom: 1,
    departureDaysTo: 14,
  },
};

const COUNTRY_OPTIONS = [
  { id: "5", label: "Турция" },
  { id: "12", label: "Египет" },
  { id: "14", label: "Греция" },
  { id: "3", label: "Испания" },
  { id: "10", label: "ОАЭ" },
  { id: "8", label: "Таиланд" },
  { id: "2", label: "Хорватия" },
  { id: "16", label: "Мальдивы" },
  { id: "17", label: "Бали" },
];

const CURRENCY_OPTIONS = ["uah", "eur", "usd"];

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<ApiConfig>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string; detail?: string; ms?: number } | null>(null);
  const [testing, setTesting] = useState(false);
  const [showAuthKey, setShowAuthKey] = useState(false);

  useEffect(() => {
    fetch("/api/admin/save-config")
      .then((r) => r.json())
      .then((data: ApiConfig) => {
        setConfig({
          ...DEFAULT,
          ...data,
          authKey: "",          // never pre-fill auth key
          hotToursSettings: {
            ...DEFAULT.hotToursSettings,
            ...(data.hotToursSettings ?? {}),
          },
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/save-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "success", msg: "Настройки сохранены успешно!" });
      } else {
        setStatus({ type: "error", msg: data.error ?? "Ошибка сохранения" });
      }
    } catch (e) {
      setStatus({ type: "error", msg: String(e) });
    } finally {
      setSaving(false);
    }
  };

  const testApi = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/tat/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: config.endpoint,
          agencyId: config.agencyId,
          domainId: config.domainId,
          authKey: config.authKey,   // blank → backend uses saved key
          currency: config.currency,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult({
          ok: true,
          msg: "Подключение успешно — TAT API отвечает",
          detail: `HTTP ${data.httpStatus} · ${data.durationMs}ms`,
          ms: data.durationMs,
        });
      } else {
        setTestResult({
          ok: false,
          msg: data.error ?? "Ошибка подключения",
          detail: data.details,
        });
      }
    } catch (e) {
      setTestResult({ ok: false, msg: "Сетевая ошибка", detail: String(e) });
    } finally {
      setTesting(false);
    }
  };

  const toggleCountry = (id: string) => {
    const list = config.hotToursSettings.priorityCountries;
    const updated = list.includes(id) ? list.filter((c) => c !== id) : [...list, id];
    setConfig({ ...config, hotToursSettings: { ...config.hotToursSettings, priorityCountries: updated } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin header */}
      <header className="bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-bold text-sm">Monotours24 Admin</span>
            <span className="text-slate-500 text-sm">/</span>
            <span className="text-slate-300 text-sm">Настройки</span>
          </div>
          <Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            На сайт
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Status */}
        {status && (
          <div className={`rounded-xl px-5 py-3.5 flex items-center gap-3 ${status.type === "success" ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"}`}>
            <span className="text-lg">{status.type === "success" ? "✅" : "❌"}</span>
            <span className="font-medium text-sm">{status.msg}</span>
          </div>
        )}

        {/* ── Section 1: CRM TAT API ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Конфигурация CRM TAT API</h2>
              <p className="text-xs text-slate-400 mt-0.5">Параметры подключения к tourscanner.crm.tat.ua</p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Endpoint */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                API Endpoint
                <span className="ml-2 font-normal text-slate-400">(параметр URL)</span>
              </label>
              <input
                type="url"
                value={config.endpoint}
                onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 font-mono transition-all"
              />
            </div>

            {/* Agency ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Agency ID
                <span className="ml-2 font-normal text-slate-400">(параметр <code className="bg-slate-100 px-1 rounded">a</code>)</span>
              </label>
              <input
                type="text"
                value={config.agencyId}
                onChange={(e) => setConfig({ ...config, agencyId: e.target.value })}
                placeholder="например: 12345"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Domain ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Domain ID
                <span className="ml-2 font-normal text-slate-400">(параметр <code className="bg-slate-100 px-1 rounded">d</code>)</span>
              </label>
              <input
                type="text"
                value={config.domainId}
                onChange={(e) => setConfig({ ...config, domainId: e.target.value })}
                placeholder="например: 67890"
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Auth Key */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Auth Key / Token
                <span className="ml-2 font-normal text-slate-400">(параметр <code className="bg-slate-100 px-1 rounded">ca</code>)</span>
              </label>
              <div className="relative">
                <input
                  type={showAuthKey ? "text" : "password"}
                  value={config.authKey}
                  onChange={(e) => setConfig({ ...config, authKey: e.target.value })}
                  placeholder="оставьте пустым если не используется"
                  className="w-full px-4 py-2.5 pr-10 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowAuthKey(!showAuthKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {showAuthKey
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                    }
                  </svg>
                </button>
              </div>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Валюта
                <span className="ml-2 font-normal text-slate-400">(параметр <code className="bg-slate-100 px-1 rounded">cu</code>)</span>
              </label>
              <div className="flex gap-2">
                {CURRENCY_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setConfig({ ...config, currency: c })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold uppercase border transition-all ${config.currency === c ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-600 hover:border-blue-300 bg-slate-50"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Test connection */}
          <div className="px-6 pb-5 border-t border-slate-100 pt-4 space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={testApi}
                disabled={testing}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors disabled:opacity-60"
              >
                {testing
                  ? <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                }
                Тест подключения
              </button>
              {testing && (
                <span className="text-xs text-slate-400">Отправляю запрос к crm.tat.ua...</span>
              )}
            </div>
            {testResult && (
              <div className={`rounded-xl px-4 py-3 flex items-start gap-3 text-sm ${
                testResult.ok
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}>
                <span className="text-base flex-shrink-0 mt-0.5">{testResult.ok ? "✅" : "❌"}</span>
                <div>
                  <div className="font-semibold">{testResult.msg}</div>
                  {testResult.detail && (
                    <div className="text-xs mt-0.5 opacity-75 font-mono">{testResult.detail}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Section 2: Hot Tours ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Настройки горящих туров</h2>
              <p className="text-xs text-slate-400 mt-0.5">Параметры автоматической выборки для главной страницы</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Departure window */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Вылет через (дней, от)</label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={config.hotToursSettings.departureDaysFrom}
                  onChange={(e) => setConfig({ ...config, hotToursSettings: { ...config.hotToursSettings, departureDaysFrom: Number(e.target.value) } })}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Вылет через (дней, до)</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={config.hotToursSettings.departureDaysTo}
                  onChange={(e) => setConfig({ ...config, hotToursSettings: { ...config.hotToursSettings, departureDaysTo: Number(e.target.value) } })}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Price range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Минимальная цена
                  <span className="ml-1 font-normal text-slate-400">(0 = без ограничения)</span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={config.hotToursSettings.minPrice}
                  onChange={(e) => setConfig({ ...config, hotToursSettings: { ...config.hotToursSettings, minPrice: Number(e.target.value) } })}
                  placeholder="0"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Максимальная цена
                  <span className="ml-1 font-normal text-slate-400">(0 = без ограничения)</span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={config.hotToursSettings.maxPrice}
                  onChange={(e) => setConfig({ ...config, hotToursSettings: { ...config.hotToursSettings, maxPrice: Number(e.target.value) } })}
                  placeholder="0"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Priority countries */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-3">
                Приоритетные страны
                <span className="ml-2 font-normal text-slate-400">(параметр <code className="bg-slate-100 px-1 rounded">ci</code>) — выберите одну или несколько</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {COUNTRY_OPTIONS.map((c) => {
                  const active = config.hotToursSettings.priorityCountries.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCountry(c.id)}
                      className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${active ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-600 hover:border-blue-300 bg-white"}`}
                    >
                      {active && <span className="mr-1">✓</span>}
                      {c.label}
                      <span className="ml-1.5 opacity-50 text-xs">#{c.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instant confirmation */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="text-sm font-semibold text-slate-800">Только моментальное подтверждение</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Параметр <code className="bg-slate-200 px-1 rounded">ic=yes</code> — показывать только туры с мгновенным бронированием
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConfig({ ...config, hotToursSettings: { ...config.hotToursSettings, instantConfirmOnly: !config.hotToursSettings.instantConfirmOnly } })}
                className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${config.hotToursSettings.instantConfirmOnly ? "bg-blue-500" : "bg-slate-300"}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${config.hotToursSettings.instantConfirmOnly ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Save button ── */}
        <div className="flex items-center justify-between pb-6">
          <p className="text-xs text-slate-400">
            Настройки сохраняются в <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">/data/api-config.json</code>
          </p>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-60 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 transition-all"
          >
            {saving
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            }
            {saving ? "Сохранение..." : "Сохранить настройки"}
          </button>
        </div>

        {/* ── API Reference ── */}
        <div className="bg-slate-900 rounded-2xl p-6 text-slate-300 text-xs font-mono">
          <div className="text-slate-500 mb-3 font-sans font-semibold text-sm">Параметры API (справка)</div>
          <div className="space-y-1.5">
            {[
              ["a", "Agency ID (ваш идентификатор агентства)"],
              ["d", "Domain ID (идентификатор домена)"],
              ["ca", "Auth Key / токен авторизации"],
              ["cu", "Валюта: uah / eur / usd"],
              ["fl=yes", "Включить перелёты"],
              ["ho=yes", "Включить отели"],
              ["ci", "ID страны назначения"],
              ["df / dt", "Дата вылета от / до (YYYY-MM-DD)"],
              ["nf / nt", "Количество ночей от / до"],
              ["pf / pt", "Цена от / до"],
              ["ad / ch", "Взрослых / детей"],
              ["ic=yes", "Только моментальное подтверждение"],
              ["s", "Сортировка: price_asc, price_desc, rating, discount_desc"],
              ["fmt=json", "Формат ответа JSON"],
            ].map(([key, desc]) => (
              <div key={key} className="flex gap-3">
                <span className="text-cyan-400 w-28 flex-shrink-0">{key}</span>
                <span className="text-slate-400">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
