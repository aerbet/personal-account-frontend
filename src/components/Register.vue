<template>
  <div class="page">
    <div class="card">
      <template v-if="step === 'phone'">
        <div class="iconWrap" aria-hidden="true">
          <div class="iconCircle">
            <font-awesome-icon :icon="currentIcon" class="iconPhone" />
          </div>
        </div>
        <h1 class="title">Вход в личный кабинет</h1>
        <p class="subtitle">Введите номер телефона для входа</p>

        <Form class="form" :validation-schema="phoneSchema" @submit="submitPhone">
          <label class="label" for="phone">Номер телефона</label>

          <Field name="phone" v-slot="{ field, errorMessage }">
            <div class="inputShell" :class="{ errorBorder: errorMessage }">
              <span class="prefix">+996</span>

              <input
                v-bind="field"
                type="tel"
                class="input"
                autocomplete="tel"
                inputmode="numeric"
                maxlength="9"
                placeholder="___ ___ ___"
                :disabled="isSubmitting"
                @input="onPhoneInput"
              />
            </div>

            <span class="error">{{ errorMessage }}</span>
          </Field>

          <button class="btn" type="submit" :disabled="isSubmitting">
            Продолжить
          </button>

          <button class="linkRow" type="button" @click="toggleTestNumbers">
            <font-awesome-icon icon="info-circle" class="infoIcon" />
            <span>Показать тестовые номера</span>
          </button>

          <div v-if="showTests" class="tests">
            <div class="testsTitle">Тестовые номера:</div>
            <ul class="testsList">
              <li>+996 700 000 001</li>
              <li>+996 700 000 002</li>
              <li>+996 700 000 003</li>
            </ul>
          </div>

          <p class="bottom">
            Нет доступа к номеру?
            <a class="support" href="#" @click.prevent="openSupport">Обратитесь в поддержку</a>
          </p>
        </Form>
      </template>

      <template v-else-if="step === 'method'">
        <h1 class="title">Выберите способ входа</h1>
        <p class="subtitle">Как вы хотите войти в систему?</p>

        <div class="methodList">
          <button type="button" class="methodCard" @click="chooseMethod('otp_email')">
            <div class="methodIcon methodIconBlue" aria-hidden="true">
              <font-awesome-icon icon="envelope" />
            </div>
            <div class="methodText">
              <div class="methodTitle">OTP код на Email</div>
              <div class="methodHint">Получите код на почту</div>
            </div>
          </button>

          <button type="button" class="methodCard" @click="chooseMethod('password')">
            <div class="methodIcon methodIconGreen" aria-hidden="true">
              <font-awesome-icon icon="lock" />
            </div>
            <div class="methodText">
              <div class="methodTitle">Вход по паролю</div>
              <div class="methodHint">Используйте установленный пароль</div>
            </div>
          </button>
        </div>

        <button class="backLink" type="button" @click="goBackToPhone">
          Назад
        </button>
      </template>

      <template v-else-if="step === 'email'">
        <h1 class="title">Добро пожаловать!</h1>
        <p class="subtitle">
          Это ваш первый вход. Пожалуйста, укажите ваш<br />
          Email для получения кодов подтверждения
        </p>

        <Form class="form" :validation-schema="emailSchema" @submit="submitEmail">
          <label class="label" for="email">Email адрес</label>


          <Field name="email" v-slot="{ field, errorMessage }">
            <div class="inputShell inputShellSingle" :class="{ errorBorder: errorMessage }">
              <input
                v-bind="field"
                id="email"
                name="email"
                type="email"
                class="input"
                autocomplete="email"
                placeholder="example@mail.com"
                :disabled="isSubmitting"
              />
            </div>

            <span class="error">{{ errorMessage }}</span>
          </Field>

          <button class="btn" type="submit" :disabled="isSubmitting">
            Продолжить
          </button>

          <p class="bottomHint">
            Email будет использоваться для восстановления доступа и
            получения важных уведомлений
          </p>

          <button class="backLink" type="button" @click="goBackToPhone">
            Назад
          </button>
        </Form>
      </template>

      <template v-else>
        <h1 class="title">Код отправлен на Email</h1>
        <p class="subtitle">Проверьте почту и введите код подтверждения</p>

        <Form class="form" :validation-schema="codeSchema" @submit="submitCode">
          <label class="label" for="code">Код подтверждения</label>

          <Field name="code" v-slot="{ field, errorMessage }">
            <div class="inputShell inputShellSingle" :class="{ errorBorder: errorMessage }">

              <input
                v-bind="field"
                id="code"
                name="code"
                type="text"
                class="input codeInput"
                inputmode="numeric"
                maxlength="6"
                placeholder="000000"
                :disabled="isSubmitting"
                @input="onCodeInput"
              />
            </div>

            <span class="error">{{ errorMessage }}</span>
          </Field>

          <p class="resend">
            <template v-if="resendSeconds > 0">
              Повторная отправка через {{ resendSeconds }} сек
            </template>
            <template v-else>
              <button class="resendBtn" type="button" @click="resendCode" :disabled="isSubmitting">
                Отправить код ещё раз
              </button>
            </template>
          </p>

          <button class="btn" type="submit" :disabled="isSubmitting">
            Войти
          </button>

          <button class="backLink" type="button" @click="goBackToEmail">
            Назад
          </button>
        </Form>
      </template>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "PhoneLogin",
  components: { Form, Field, ErrorMessage},
  data() {
    return {
      API_BASE: "/api",
      loginMethod: null,
      userExists: false,

      step: "phone",
      isSubmitting: false,
      showTests: false,

      phoneDigits: "",
      emailValue: "",

      resendSeconds: 0,
      resendTimerId: null,

      phoneSchema: yup.object({
        phone: yup
          .string()
          .required("Введите номер телефона")
          .matches(/^\d{9}$/, "Введите корректный номер телефона"),
      }),

      emailSchema: yup.object({
        email: yup
          .string()
          .required("Введите Email")
          .email("Введите корректный Email"),
      }),

      codeSchema: yup.object({
        code: yup
          .string()
          .required("Введите код")
          .matches(/^\d{6}$/, "Введите корректный код из 6 цифр"),
      }),
    };
  },

  computed: {
    currentIcon() {
      if (this.step === "phone") return "phone";
      if (this.step === "method") return "";
      if (this.step === "email") return "envelope";
      if (this.step === "code") return "info-circle";
      return "envelope";
    },
  },

  beforeUnmount() {
    this.stopResendTimer();
  },

  methods: {
    async postJson(path, payload) {
      const res = await fetch(`${this.API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch (_) {}

      if (!res.ok) {
        const msg = data?.message || data?.error || text || `HTTP ${res.status}`;
        
        throw new Error(msg);
      }

      return data ?? text;
    },

    onPhoneInput(e) {
      const raw = String(e.target.value ?? "");
      const digits = raw.replace(/\D/g, "").slice(0, 9);
      e.target.value = digits;
    },

    async checkUserExists(phoneNumber) {
      return await this.postJson("/auth/phone", { phoneNumber });
    },

    async submitPhone(values) {
      this.isSubmitting = true;
      try {
        this.phoneDigits = values.phone;
        const phoneNumber = `+996${this.phoneDigits}`;

        const exists = await this.checkUserExists(phoneNumber);

        if (exists === true) {
          this.phoneDigits = values.phone;
          const phoneNumber = `+996${this.phoneDigits}`;

          const exists = await this.checkUserExists(phoneNumber);
          this.userExists = exists === true;

          this.step = "method";
        } else {
          this.step = "email";
        }
      } catch (e) {
          alert(e?.message || "Ошибка при проверке номера");
      } finally {
          this.isSubmitting = false;
      }
    },

    async chooseMethod(method) {
      this.loginMethod = method;

      if (method === "otp_email") {
        if (this.userExists) {
          this.isSubmitting = true;
          try {
            await this.postJson("/auth/otp/generate", {
              phoneNumber: `+996${this.phoneDigits}`,
            });

            this.step = "code"; 
            this.startResendTimer(57); // otp/generate лучше вызывать в resendCode чтобы по истечению таймера код автоматически отправлялся или по нажатию кнопки
          } catch (e) {
            alert(e?.message || "Не удалось отправить код");
          } finally {
            this.isSubmitting = false;
          }
        } else {
          this.step = "email";
        }
        return;
      }

      if (method === "password") {
        alert("Логин по паролю пока не реализован");
      }
    },

    toggleTestNumbers() {
      this.showTests = !this.showTests;
    },

    openSupport() {
      alert("Переход в поддержку (заглушка)");
    },

    async submitEmail(values) {
      this.isSubmitting = true;
      try {
        this.emailValue = values.email;

        const payload = {
          phoneNumber: `+996${this.phoneDigits}`,
          email: this.emailValue,
          password: "qwe",
        };

        await this.postJson("/auth/register", payload);

        this.step = "code";
        this.startResendTimer(57);
      } catch (e) {
        alert(e?.message || "Ошибка регистрации");
      } finally {
        this.isSubmitting = false;
      }
    },

    goBackToPhone() {
      this.step = "phone";
    },

    onCodeInput(e) {
      const raw = String(e.target.value ?? "");
      const digits = raw.replace(/\D/g, "").slice(0, 6);
      e.target.value = digits;
    },

    async submitCode(values) {
      this.isSubmitting = true;
      try {
        const payload = {
          phoneNumber: `+996${this.phoneDigits}`,
          otp: values.code,
        };
        
        const result = await this.postJson("/auth/verify", payload);
        this.$router.push("/main");
      } catch (e) {
        alert(e?.message || "Неверный или истёкший код");
      } finally {
        this.isSubmitting = false;
      }
    },

    goBackToEmail() {
      this.stopResendTimer();
      this.step = "email";
    },

    resendCode() {
      this.startResendTimer(57);
    },

    startResendTimer(seconds) {
      this.stopResendTimer();
      this.resendSeconds = seconds;

      this.resendTimerId = setInterval(() => {
        this.resendSeconds -= 1;
        if (this.resendSeconds <= 0) {
          this.stopResendTimer();
          this.resendSeconds = 0;
        }
      }, 1000);
    },

    stopResendTimer() {
      if (this.resendTimerId) {
        clearInterval(this.resendTimerId);
        this.resendTimerId = null;
      }
    },
  },
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
  background: #eef3ff;
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.card {
  width: 100%;
  max-width: 450px;
  background: #ffffff;
  border-radius: 16px;
  padding: 36px 40px 26px;
  box-shadow: 0 14px 40px rgba(16, 24, 40, 0.12);
}

.iconWrap {
  display: flex;
  justify-content: center;
  margin-bottom: 14px;
}
.iconCircle {
  width: 70px;
  height: 70px;
  border-radius: 999px;
  background: #e8f0ff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.iconPhone {
  font-size: 30px;
  color: #155dfc;
}

.title {
  margin: 0;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #0f172a;
}
.subtitle {
  margin: 8px 0 22px;
  text-align: center;
  font-size: 16px;
  line-height: 1.35;
  color: #64748b;
}

.form {
  margin-top: 6px;
}

.label {
  display: block;
  font-size: 14px;
  color: #334155;
  margin-bottom: 8px;
  font-weight: 600;
}

.inputShell {
  display: flex;
  align-items: center;
  border: 1px solid #d8e0f0;
  border-radius: 10px;
  padding: 12px 14px;
  background: #fff;
}

.inputShell.errorBorder {
  border: 1px solid #ee3333;
}

.inputShellSingle {
  padding: 12px 14px;
}

.prefix {
  font-size: 16px;
  color: #7c7c7c;
  margin-right: 5px;
  white-space: nowrap;
}

.input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 16px;
  color: #585858;
}

.codeInput {
  letter-spacing: 0.12em;
}

.input::placeholder {
  color: #94a3b8;
}

.error {
  margin-top: 8px;
  font-size: 16px;
  color: #ee3333;
}

.btn {
  width: 100%;
  margin-top: 16px;
  height: 60px;
  border: none;
  border-radius: 10px;
  background: #155dfc;
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.05s ease, opacity 0.2s ease;
}
.btn:active {
  transform: translateY(1px);
}
.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.linkRow {
  margin: 14px auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  background: transparent;
  color: #155dfc;
  cursor: pointer;
  font-size: 16px;
  padding: 6px 8px;
}
.infoIcon {
  font-size: 16px;
}

.methodList {
  display: grid;
  gap: 14px;
  margin-top: 18px;
}

.methodCard {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;

  padding: 18px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #fff;

  cursor: pointer;
  text-align: left;

  transition: box-shadow 0.15s ease, border-color 0.15s ease, transform 0.05s ease;
}

.methodCard:hover {
  box-shadow: 0 8px 24px rgba(17, 24, 39, 0.08);
  border: 3px solid #155efcd3;
}

.methodCard:active {
  transform: translateY(1px);
}

.methodCard.active {
  border-color: #93c5fd;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.12);
}

.methodIcon {
  width: 55px;
  height: 55px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 22px;
}

.methodIconBlue {
  background: #e0ecff;
  color: #2563eb;
}

.methodIconGreen {
  background: #dcfce7;
  color: #16a34a;
}

.methodText {
  display: grid;
  gap: 4px;
}

.methodTitle {
  font-weight: 600;
  font-size: 18px;
  color: #111827;
}

.methodHint {
  font-size: 16px;
  color: #6b7280;
}

.tests {
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #f6f8ff;
  border: 1px solid #e6ecff;
  color: #334155;
}
.testsTitle {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 6px;
}
.testsList {
  margin: 0;
  padding-left: 18px;
  font-size: 16px;
  color: #475569;
}

.bottom {
  margin: 16px 0 0;
  text-align: center;
  font-size: 16px;
  color: #64748b;
}
.support {
  color: #155dfc;
  text-decoration: none;
}
.support:hover {
  text-decoration: underline;
}

.bottomHint {
  margin: 14px 0 0;
  text-align: center;
  font-size: 16px;
  color: #64748b;
  line-height: 1.35;
}

.backLink {
  margin: 14px auto 0;
  display: block;
  border: none;
  background: transparent;
  color: #0f172a;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 10px;
}

.resend {
  margin: 14px 0 0;
  text-align: center;
  font-size: 13px;
  color: #64748b;
}
.resendBtn {
  border: none;
  background: transparent;
  color: #155dfc;
  cursor: pointer;
  font-weight: 600;
}
.resendBtn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .card {
    padding: 28px 20px 20px;
  }
}
</style>