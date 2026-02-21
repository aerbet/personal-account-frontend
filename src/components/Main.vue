<template>
  <div class="lk">
    <header class="topbar">
      <div class="brand">
        <div class="logo" aria-hidden="true"></div>
        <div class="brandTitle">Личный кабинет</div>
      </div>

      <div class="topRight">
        <div class="contract">{{ contractNumber }}</div>
        <button class="logout" type="button" @click="onLogout">
          <span class="logoutIcon" aria-hidden="true">⎋</span>
          Выход
        </button>
      </div>
    </header>

    <nav class="tabs" aria-label="Навигация">
      <button
        v-for="t in tabs"
        :key="t.key"
        type="button"
        class="tab"
        :class="{ active: activeTab === t.key }"
        @click="activeTab = t.key"
      >
        <span class="tabIcon" aria-hidden="true">{{ t.icon }}</span>
        <span class="tabText">{{ t.label }}</span>
      </button>
    </nav>

    <main class="content">
      <section class="gridTop">
        <article class="card balance">
          <div class="cardHead">
            <div class="badgeIcon" aria-hidden="true">▭</div>
            <div class="cardHeadTitle">Баланс</div>
          </div>

          <div class="balanceValue">
            {{ balance }} <span class="rub">₽</span>
          </div>
          <div class="balanceHint">Доступно для использования</div>
        </article>

        <article class="card">
          <div class="cardHead">
            <div class="chip chipGreen" aria-hidden="true">⚡</div>
            <div class="cardHeadTitle">Тарифный план</div>
          </div>

          <div class="tariffTitle">{{ tariff.name }}</div>
          <div class="tariffSub">Действует до {{ tariff.until }}</div>

          <button class="btnOutline" type="button" @click="onChangeTariff">
            Изменить тариф
          </button>
        </article>

        <article class="card">
          <div class="cardHead">
            <div class="chip chipOrange" aria-hidden="true">!</div>
            <div class="cardHeadTitle">Активные заявки</div>
          </div>

          <div class="ticketsCount">{{ activeTicketsCount }}</div>
          <div class="ticketsSub">Требуют внимания</div>

          <button class="btnLight" type="button" @click="activeTab = 'tickets'">
            Перейти в поддержку
          </button>
        </article>
      </section>

      <section class="card sectionCard">
        <div class="sectionHead">
          <h2 class="sectionTitle">Подключенные услуги</h2>
          <button class="linkBtn" type="button" @click="onAllServices">
            Все услуги <span aria-hidden="true">→</span>
          </button>
        </div>

        <div class="services">
          <div v-for="s in services" :key="s.id" class="serviceRow">
            <div class="serviceText">
              <div class="serviceName">{{ s.title }}</div>
              <div class="serviceDesc">{{ s.desc }}</div>
            </div>

            <label class="switch">
              <input type="checkbox" v-model="s.enabled" />
              <span class="slider" aria-hidden="true"></span>
            </label>
          </div>
        </div>
      </section>

      <section class="card sectionCard">
        <div class="sectionHead">
          <h2 class="sectionTitle">Поддержка</h2>

          <button class="btnPrimary" type="button" @click="onCreateTicket">
            <span class="plus" aria-hidden="true">+</span>
            Подать заявку
          </button>
        </div>

        <div class="tickets">
          <div v-for="t in tickets" :key="t.id" class="ticketRow">
            <div class="ticketInfo">
              <div class="ticketTitle">{{ t.title }}</div>
              <div class="ticketDate">Создана: {{ t.createdAt }}</div>
            </div>

            <span class="status" :class="statusClass(t.status)">
              {{ statusText(t.status) }}
            </span>
          </div>
        </div>
      </section>

      <section class="card sectionCard">
        <div class="sectionHead">
          <h2 class="sectionTitle">Последние транзакции</h2>
        </div>

        <div class="table">
          <div class="row head">
            <div class="cell">Дата</div>
            <div class="cell">Описание</div>
            <div class="cell right">Сумма</div>
          </div>

          <div v-for="tr in transactions" :key="tr.id" class="row">
            <div class="cell">{{ tr.date }}</div>
            <div class="cell">{{ tr.desc }}</div>
            <div class="cell right" :class="tr.amount > 0 ? 'pos' : 'neg'">
              {{ tr.amount > 0 ? `+${tr.amount}` : tr.amount }} ₽
            </div>
          </div>
        </div>

        <button class="linkCenter" type="button" @click="onDetails">
          Вся детализация расходов
        </button>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      contractNumber: "3211313133213",
      tabs: [
        { key: "home", label: "Главная", icon: "🏠" },
        { key: "services", label: "Услуги", icon: "⚙" },
        { key: "tickets", label: "Заявки", icon: "🗒" },
        { key: "details", label: "Детализация", icon: "▦" },
        { key: "settings", label: "Настройки", icon: "⚙" },
      ],
      activeTab: "home",

      balance: 451,
      tariff: { name: "Безлимит PRO", until: "15.12.2023" },
      activeTicketsCount: 2,

      services: [
        { id: 1, title: "Интернет 100 Мбит", desc: "Базовый доступ", enabled: true },
        { id: 2, title: "Мобильный интернет", desc: "20 ГБ в месяц", enabled: true },
      ],

      tickets: [
        { id: 1, title: "Проблема с интернетом", createdAt: "2026-01-10", status: "open" },
        { id: 2, title: "Вопрос по тарифу", createdAt: "2026-01-08", status: "in_progress" },
      ],

      transactions: [
        { id: 1, date: "15.01.2026", desc: "Пополнение баланса", amount: 500 },
        { id: 2, date: "13.01.2026", desc: "Списание за тариф", amount: -500 },
        { id: 3, date: "13.01.2026", desc: "Облачное хранилище", amount: -100 },
        { id: 4, date: "10.01.2026", desc: "Доп. пакет интернета", amount: -150 },
      ],
    };
  },
  methods: {
    statusText(s) {
      if (s === "open") return "Открыта";
      if (s === "in_progress") return "В обработке";
      return "Закрыта";
    },
    statusClass(s) {
      if (s === "open") return "stOpen";
      if (s === "in_progress") return "stProgress";
      return "stClosed";
    },

    onLogout() {
      this.$route("/");
    },
    onChangeTariff() {
      alert("Изменить тариф (заглушка)");
    },
    onAllServices() {
      this.activeTab = "services";
    },
    onCreateTicket() {
      alert("Создать заявку (заглушка)");
    },
    onDetails() {
      this.activeTab = "details";
    },
  },
};
</script>

<style scoped>
 Page 
.lk {
  min-height: 100vh;
  background: #f5f7fb;
  color: #0f172a;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}

 Topbar 
.topbar {
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e6eaf2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 22px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.logo {
  width: 34px;
  height: 24px;
  border-radius: 8px;
  background: #2563eb;
}
.brandTitle {
  font-weight: 700;
  font-size: 16px;
}

.topRight {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #475569;
}
.contract {
  font-size: 13px;
}
.logout {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
  color: #0f172a;
}
.logoutIcon {
  font-size: 14px;
}

 Tabs 
.tabs {
  background: #ffffff;
  border-bottom: 1px solid #e6eaf2;
  display: flex;
  justify-content: center;
  gap: 18px;
  padding: 10px 16px;
}
.tab {
  border: none;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  color: #475569;
  font-weight: 600;
}
.tabIcon {
  font-size: 14px;
}
.tab.active {
  color: #2563eb;
  position: relative;
}
.tab.active::after {
  content: "";
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: -10px;
  height: 2px;
  background: #2563eb;
  border-radius: 2px;
}

 Content 
.content {
  max-width: 1120px;
  margin: 22px auto;
  padding: 0 16px 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

 Cards grid top 
.gridTop {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 18px;
}

.card {
  background: #ffffff;
  border: 1px solid #e6eaf2;
  border-radius: 18px;
  box-shadow: 0 10px 22px rgba(16, 24, 40, 0.06);
  padding: 18px 18px;
}

.cardHead {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.cardHeadTitle {
  font-size: 13px;
  color: #475569;
  font-weight: 700;
}
.badgeIcon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 800;
}

 Balance card 
.balance {
  color: #fff;
  border: none;
  background: radial-gradient(140px 120px at 95% 5%, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 70%),
    linear-gradient(135deg, #7c3aed 0%, #d946ef 65%, #db2777 100%);
}
.balanceValue {
  font-size: 54px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.02em;
}
.rub {
  font-weight: 900;
  opacity: 0.95;
}
.balanceHint {
  margin-top: 10px;
  font-size: 13px;
  opacity: 0.92;
}

 Chips 
.chip {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}
.chipGreen {
  background: #e8f7ee;
  color: #16a34a;
}
.chipOrange {
  background: #fff3e8;
  color: #f97316;
}

.tariffTitle {
  font-weight: 900;
  font-size: 22px;
  margin-top: 6px;
}
.tariffSub {
  color: #64748b;
  font-size: 13px;
  margin-top: 6px;
  margin-bottom: 14px;
}

.ticketsCount {
  font-weight: 900;
  font-size: 34px;
  margin-top: 6px;
}
.ticketsSub {
  color: #64748b;
  font-size: 13px;
  margin-top: 6px;
  margin-bottom: 14px;
}

 Buttons 
.btnOutline {
  width: 100%;
  height: 44px;
  border-radius: 12px;
  border: 2px solid #2563eb;
  background: transparent;
  color: #2563eb;
  font-weight: 800;
  cursor: pointer;
}
.btnLight {
  width: 100%;
  height: 44px;
  border-radius: 12px;
  border: 1px solid #e6eaf2;
  background: #f1f4fb;
  color: #0f172a;
  font-weight: 800;
  cursor: pointer;
}
.btnPrimary {
  height: 44px;
  padding: 0 16px;
  border-radius: 12px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.plus {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.22);
  font-weight: 900;
}

 Section cards 
.sectionCard {
  padding: 18px 18px;
}
.sectionHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
}
.sectionTitle {
  margin: 0;
  font-size: 18px;
  font-weight: 900;
}
.linkBtn {
  border: none;
  background: transparent;
  color: #2563eb;
  cursor: pointer;
  font-weight: 700;
}

 Services 
.services {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.serviceRow {
  border: 1px solid #eef2f7;
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.serviceName {
  font-weight: 900;
  font-size: 14px;
}
.serviceDesc {
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
}

 Switch 
.switch {
  position: relative;
  width: 46px;
  height: 26px;
  display: inline-block;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  inset: 0;
  background: #e2e8f0;
  border-radius: 999px;
  transition: 0.2s ease;
}
.slider::after {
  content: "";
  position: absolute;
  left: 3px;
  top: 3px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 999px;
  box-shadow: 0 4px 10px rgba(16, 24, 40, 0.12);
  transition: 0.2s ease;
}
.switch input:checked + .slider {
  background: #22c55e;
}
.switch input:checked + .slider::after {
  transform: translateX(20px);
}

.tickets {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ticketRow {
  border: 1px solid #eef2f7;
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.ticketTitle {
  font-weight: 900;
  font-size: 14px;
}
.ticketDate {
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
}

.status {
  font-size: 12px;
  font-weight: 800;
  padding: 8px 12px;
  border-radius: 999px;
  white-space: nowrap;
  border: 1px solid transparent;
}
.stOpen {
  background: #fff7ed;
  color: #f59e0b;
  border-color: #fde68a;
}
.stProgress {
  background: #eff6ff;
  color: #2563eb;
  border-color: #bfdbfe;
}
.stClosed {
  background: #f1f5f9;
  color: #334155;
  border-color: #e2e8f0;
}

 Table 
.table {
  width: 100%;
  margin-top: 6px;
}
.row {
  display: grid;
  grid-template-columns: 140px 1fr 140px;
  gap: 12px;
  padding: 14px 10px;
  border-top: 1px solid #eef2f7;
}
.row.head {
  border-top: none;
  padding-top: 10px;
  padding-bottom: 10px;
  color: #64748b;
  font-weight: 800;
  font-size: 12px;
}
.cell {
  font-size: 14px;
  color: #0f172a;
}
.right {
  text-align: right;
}
.pos {
  color: #16a34a;
  font-weight: 900;
}
.neg {
  color: #ef4444;
  font-weight: 900;
}

.linkCenter {
  width: 100%;
  margin-top: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #2563eb;
  font-weight: 800;
  padding: 10px 0;
}

@media (max-width: 980px) {
  .gridTop {
    grid-template-columns: 1fr;
  }
  .services {
    grid-template-columns: 1fr;
  }
  .row {
    grid-template-columns: 120px 1fr 120px;
  }
}
</style>