import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getValueAlignment } from '../services/ai'
import './GoalDetail.css'

/* ─── Helpers ────────────────────────────────── */

function loadGoal(id) {
  try {
    const goals = JSON.parse(localStorage.getItem('trumi_goals') ?? '[]')
    return goals.find(g => String(g.id) === String(id)) ?? null
  } catch { return null }
}

function saveGoal(updatedGoal) {
  try {
    const goals = JSON.parse(localStorage.getItem('trumi_goals') ?? '[]')
    const next = goals.map(g => String(g.id) === String(updatedGoal.id) ? updatedGoal : g)
    localStorage.setItem('trumi_goals', JSON.stringify(next))
  } catch { /* noop */ }
}

function loadEntriesForGoal(goalId) {
  try {
    const entries = JSON.parse(localStorage.getItem('trumi_log_entries') ?? '[]')
    return entries.filter(e => String(e.goalId) === String(goalId))
  } catch { return [] }
}

function loadUserValues() {
  try { return JSON.parse(localStorage.getItem('trumi_values') ?? '{}') } catch { return {} }
}

function getTodayISO() {
  return new Date().toISOString().split('T')[0]
}

/** Array of 31 days: 30 days ago → today (today is last / rightmost). */
function generateDayRange() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = []
  for (let i = 30; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push({
      iso:      d.toISOString().split('T')[0],
      dayNum:   d.getDate(),
      dayLabel: d.toLocaleDateString('en-US', { weekday: 'short' }),
      isToday:  i === 0,
    })
  }
  return days
}

const CONTRIBUTION_LABELS = {
  lot:       'Yes, a lot!',
  somewhat:  'Somewhat',
  not_today: 'Not Today',
}

const FALLBACK_VALUES = [
  'Health', 'Growth', 'Connection', 'Peace', 'Family',
  'Creativity', 'Freedom', 'Balance', 'Play', 'Mental Health',
  'Self Care', 'Adventure',
]

/* ─── Mood SVG faces ─────────────────────────── */

function FaceHappy() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#136F1F"/>
      <circle cx="17" cy="20" r="3" fill="white"/>
      <circle cx="31" cy="20" r="3" fill="white"/>
      <path d="M15 29c2.5 4 15.5 4 18 0" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

function FaceNeutral() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#DFBC0E"/>
      <circle cx="17" cy="20" r="3" fill="white"/>
      <circle cx="31" cy="20" r="3" fill="white"/>
      <path d="M16 30h16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

function FaceSad() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#B01B11"/>
      <circle cx="17" cy="20" r="3" fill="white"/>
      <circle cx="31" cy="20" r="3" fill="white"/>
      <path d="M15 33c2.5-4 15.5-4 18 0" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

const MOOD_FACES = { happy: FaceHappy, neutral: FaceNeutral, sad: FaceSad }

/* ─── ValuesCharacter illustration ──────────── */

function ValuesCharacter() {
  return (
    <svg className="gd-values__character" width="99" height="99" viewBox="0 0 99 99" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M31.8064 24.5995C31.8064 24.5995 -0.0941046 46.2983 15.1139 80.7663C15.6674 82.0295 16.3056 83.3303 16.9851 84.6297L20.969 92.1799L36.8484 86.8358C36.8484 86.8358 18.2298 57.9565 28.2361 44.6051C30.5246 41.8475 32.5427 41.4688 33.0725 39.3278L29.1327 38.5031L31.7634 24.5599L31.8064 24.5995Z" fill="white"/>
      <path d="M20.9836 92.5113L21.0661 92.5077L36.9455 87.1636C37.0284 87.16 37.1078 87.0734 37.1454 86.9886L37.1328 86.6985C36.9542 86.416 18.7232 57.8523 28.5354 44.7997C29.4813 43.6372 30.3641 42.9342 31.1658 42.2764C32.249 41.3985 33.0919 40.7388 33.4489 39.3944L33.438 39.1457C33.3927 39.0647 33.3079 39.0268 33.2236 38.989L29.5776 38.2345L32.1792 24.5832C32.1738 24.4589 32.1684 24.3346 32.0405 24.2571C31.9127 24.1796 31.7885 24.185 31.7091 24.2716C31.6279 24.3166 23.6061 29.8576 17.5923 39.5466C12.0033 48.5111 7.02678 62.9307 14.9105 80.8582C15.4657 82.1627 16.1035 83.464 16.7834 84.763L20.7673 92.3131C20.814 92.4356 20.9401 92.4719 21.0643 92.4665L20.9836 92.5113ZM36.3434 86.6916L21.1183 91.7995L17.2699 84.4924C16.5918 83.2346 15.954 81.9338 15.3988 80.6293C7.60891 62.9466 12.5115 48.7381 18.0229 39.9015C23.0296 31.876 29.3685 26.7823 31.3794 25.2826L28.8802 38.4311C28.8875 38.5969 28.936 38.7608 29.1037 38.7951L32.708 39.5513C32.3747 40.4795 31.6918 41.0076 30.7297 41.797C29.9675 42.4117 29.0053 43.2012 28.02 44.4069C23.8614 49.9869 24.0109 59.1164 28.5089 70.8382C31.4637 78.5991 35.4459 85.1527 36.3829 86.6485L36.3434 86.6916Z" fill="black"/>
      <path d="M40.3732 42.9544C40.3732 42.9544 42.4949 47.8034 37.5227 47.1069C32.5506 46.4103 18.6349 46.3117 23.0674 65.0962L44.1756 55.8694C44.1756 55.8694 47.6551 53.7657 46.0162 48.5633C44.3774 43.361 40.3314 42.9562 40.3314 42.9562L40.3732 42.9544Z" fill="black"/>
      <path d="M44.5342 55.5212C44.5342 55.5212 42.3611 56.1562 41.26 54.7093C41.26 54.7093 40.0148 56.6324 37.3045 56.3769C34.5942 56.1213 34.2803 53.6848 34.2803 53.6848C34.2803 53.6848 33.9508 56.6064 31.3216 57.2607C28.6924 57.9156 25.4726 60.2569 25.8677 62.6481C25.8948 63.2697 25.3341 62.7959 25.1306 61.9326C24.977 61.2752 23.7428 61.5366 23.3357 61.7207C20.8021 62.6616 21.2097 66.2982 22.4123 68.1559C23.6145 70.0135 23.3312 69.2368 24.009 69.5398C24.009 69.5398 26.0236 79.5425 24.8274 81.6297L50.7552 78.1724C50.7552 78.1724 47.0814 71.0657 46.7275 65.8073C46.3735 60.549 44.493 55.523 44.493 55.523L44.5342 55.5212Z" fill="white"/>
      <path d="M24.8815 81.9181L50.8092 78.4607C50.8921 78.4571 51.0129 78.3692 51.0507 78.2844C51.0885 78.1996 51.0831 78.0754 51.038 77.9943C51.0344 77.9113 47.4058 70.8857 47.0568 65.7516C46.7047 60.5345 44.8223 55.4673 44.7775 55.3861C44.729 55.222 44.5594 55.1467 44.3953 55.1952C44.3953 55.1952 42.4257 55.7381 41.4579 54.493C41.4126 54.4119 41.2865 54.3756 41.2035 54.3792C41.121 54.3828 40.9982 54.43 40.9605 54.5147C40.9224 54.5991 39.7911 56.2683 37.2898 56.0449C34.8733 55.8602 34.572 53.7138 34.5684 53.6308C34.5612 53.4649 34.4315 53.3461 34.2656 53.3533C34.0996 53.3606 33.9808 53.4902 33.945 53.6162C33.9504 53.7409 33.6065 56.3306 31.2243 56.9329C28.761 57.5801 25.5713 59.6712 25.5125 62.124C25.5089 62.041 25.4617 61.9181 25.4151 61.7957C25.363 61.549 25.231 61.3885 25.0184 61.2734C24.3805 60.9273 23.3191 61.3475 23.1949 61.3529C22.2958 61.6829 21.6614 62.3747 21.3281 63.3032C20.7771 64.9466 21.2837 67.0422 22.0843 68.2533C22.4859 68.9003 23.0467 69.3742 23.6827 69.6785C24.2655 72.5597 25.4126 79.8185 24.5261 81.3935C24.4472 81.4801 24.4526 81.6043 24.5405 81.7254C24.5859 81.8065 24.7137 81.8836 24.7967 81.88L24.8815 81.9181ZM50.328 77.9008L25.3499 81.2331C26.0992 78.4181 24.5459 70.4298 24.3388 69.4836C24.3352 69.4006 24.2486 69.3217 24.162 69.2424C23.569 68.9775 23.0517 68.5431 22.695 67.9772C21.9847 66.9285 21.5265 64.9971 22.0041 63.5644C22.2617 62.8055 22.7768 62.2434 23.4723 62.0049C23.84 61.8644 24.4997 61.7525 24.7971 61.9058C24.8384 61.904 24.8832 61.9852 24.885 62.0264C25.0387 62.6843 25.399 63.3331 25.8533 63.2715C25.9363 63.2679 26.2641 63.1704 26.2424 62.6731L26.2406 62.6318C25.894 60.4043 29.0366 58.1908 31.4605 57.5867C33.2265 57.1362 33.9973 55.7735 34.3701 54.8024C34.7794 55.6149 35.6104 56.5752 37.3187 56.7083C39.528 56.9026 40.8076 55.767 41.3227 55.2048C42.3196 56.158 43.7663 56.0117 44.3848 55.9016C44.765 57.006 46.2004 61.3455 46.52 65.8164C46.845 70.4114 49.5941 76.3129 50.3692 77.899L50.328 77.9008Z" fill="black"/>
      <path d="M24.9807 69.9125C26.8872 69.8293 27.5647 68.2217 27.6041 68.1786C27.6799 68.009 27.5897 67.8467 27.4206 67.771C27.251 67.6957 27.0887 67.7855 27.0129 67.955C27.0166 68.038 26.2565 69.6492 24.1193 69.2024C23.9534 69.2096 23.7893 69.2586 23.7552 69.4259C23.7212 69.5936 23.811 69.756 23.9787 69.79C24.3138 69.8585 24.6474 69.8852 24.9376 69.8726L24.9807 69.9125Z" fill="black"/>
      <path d="M41.8472 66.2697C41.7516 65.9832 41.4111 65.7904 41.1264 65.9273C40.3085 66.2119 38.9569 66.6448 37.8253 66.4034C36.6932 66.1621 38.2257 69.8741 40.606 69.2306C42.9868 68.5866 42.0924 67.1307 41.8472 66.2697Z" fill="black"/>
      <path d="M42.3635 61.9281C43.3995 61.8829 44.1998 61.1834 44.1654 60.3959C44.131 59.6084 44.1527 60.1057 44.0644 59.9851C44.0154 59.821 43.8046 59.7475 43.6427 59.8373C43.4786 59.8862 43.4047 60.097 43.4949 60.2594L43.5039 60.4666C43.5238 60.9222 42.9598 61.3207 42.2965 61.3496C41.6336 61.3785 41.037 61.0307 41.0171 60.5751C40.9972 60.119 40.8784 60.2486 40.6712 60.2577C40.4635 60.2667 40.3448 60.3968 40.3538 60.604C40.3882 61.3916 41.2464 62.0182 42.2823 61.973L42.3635 61.9281Z" fill="black"/>
      <path d="M34.6194 63.3873C35.6558 63.3421 36.4557 62.6431 36.4213 61.8556C36.3869 61.068 36.4086 61.5654 36.3202 61.4443C36.2717 61.2807 36.0609 61.2067 35.8986 61.2969C35.7344 61.3454 35.661 61.5562 35.7507 61.7186L35.7598 61.9258C35.7797 62.3819 35.2161 62.7799 34.5528 62.8088C33.8895 62.8378 33.2929 62.4904 33.273 62.0343C33.2531 61.5782 33.1343 61.7083 32.9271 61.7173C32.7199 61.7264 32.6011 61.856 32.6101 62.0632C32.6445 62.8508 33.5022 63.4779 34.5382 63.4327L34.6194 63.3873Z" fill="black"/>
      <path d="M24.7903 67.4706C24.9146 67.4651 25.0393 67.4597 25.1599 67.3713C25.324 67.3228 25.3975 67.112 25.3077 66.9497C25.2588 66.7855 25.048 66.7121 24.8856 66.8018C24.4372 66.9877 23.9558 66.4272 23.9268 65.7639C23.8979 65.1011 24.2099 64.6305 24.6243 64.6124C25.0387 64.5943 24.9503 64.4737 24.9412 64.2665C24.9322 64.0593 24.8025 63.9401 24.5953 63.9491C23.849 63.9817 23.2618 64.7963 23.3034 65.7498C23.3451 66.7033 24.001 67.4637 24.7473 67.4311L24.7903 67.4706Z" fill="black"/>
      <path d="M79.7217 15.9058C79.7217 15.9058 41.7556 7.09799 35.6539 7.15664L28.8198 38.0186L71.6931 46.9859C71.6931 46.9859 79.6541 21.0165 79.7217 15.9058Z" fill="#6666CC"/>
      <path d="M71.874 47.3102L71.946 47.0579C72.2738 46.0054 79.9448 21.0038 80.0124 15.893L80.0016 15.6443L79.7908 15.5705C78.2391 15.223 41.6984 6.72671 35.638 6.78357L35.3896 6.79441L28.4548 38.2006L71.9136 47.267L71.874 47.3102ZM79.3998 16.1274C79.1303 21.3716 72.3041 43.8447 71.4684 46.5804L29.1825 37.7535L35.8742 7.43767C42.2773 7.61501 76.1289 15.3981 79.3998 16.1274Z" fill="black"/>
      <path d="M74.334 19.0062C74.334 19.0062 42.2735 12.3077 39.6122 12.2162L34.296 35.0388L68.69 41.9261L74.3755 19.0044L74.334 19.0062Z" fill="white"/>
      <path d="M68.6613 42.2182C68.7856 42.2128 68.9063 42.1244 68.9424 41.9983L74.6278 19.0766L74.6169 18.8279C74.5719 18.7468 74.4872 18.7089 74.4024 18.6711C73.1031 18.3956 42.2591 11.9762 39.596 11.8433C39.43 11.8505 39.3094 11.9389 39.2731 12.065L33.9574 34.8876L33.9683 35.1363C34.0132 35.2173 34.0979 35.2552 34.1827 35.293L68.5765 42.1803L68.6595 42.1767L68.6613 42.2182ZM73.9286 19.2316L68.4251 41.5641L34.6584 34.7739L39.8321 12.4974C43.5444 12.8753 70.701 18.542 73.97 19.2298L73.9286 19.2316Z" fill="black"/>
      <path d="M55.8181 17.1982C56.9103 17.4827 57.87 24.2512 57.87 24.2512C57.87 24.2512 64.619 24.7457 64.2751 26.3802C63.9311 28.0148 58.8404 29.3582 58.8404 29.3582C58.8404 29.3582 60.8942 36.4526 59.5661 36.4691C58.2379 36.4855 53.1874 30.1863 53.1874 30.1863C53.1874 30.1863 47.5041 34.1302 45.0895 33.0313C42.6745 31.9324 48.8528 26.9702 48.8528 26.9702C48.8528 26.9702 43.9395 22.8659 44.1631 22.2747C44.3862 21.6837 51.7373 22.6502 51.7373 22.6502C51.7373 22.6502 54.8521 16.9497 55.8596 17.1964L55.8181 17.1982Z" fill="#D7FF8A"/>
      <path d="M59.5386 36.8025C59.7459 36.7935 59.9081 36.7034 60.0252 36.5321C60.7711 35.5444 59.5792 31.07 59.1824 29.5924C60.3718 29.2498 64.2226 28.0436 64.5269 26.4523C64.599 26.2 64.5034 25.9135 64.3286 25.7135C63.4039 24.508 59.232 24.0672 58.066 23.9935C57.7611 21.7644 56.9404 17.2322 55.8483 16.9477C54.7976 16.6613 52.706 20.1163 51.4737 22.3294C44.0796 21.3233 43.8995 21.9541 43.7843 22.1667C43.7104 22.3776 43.4868 22.9687 48.3135 26.9938C47.2398 28.0788 44.1424 31.3285 44.4111 32.7287C44.4237 33.0188 44.64 33.217 44.8943 33.3305C47.1815 34.3519 51.9509 31.3615 53.0808 30.6062C57.823 36.5036 59.2899 36.8134 59.5386 36.8025ZM55.7475 17.4919C56.2106 17.6378 57.0527 20.7571 57.5381 24.2657L57.5489 24.5144L57.839 24.5017C59.8394 24.6636 63.267 25.1784 63.8853 26.0235C63.9736 26.1442 63.9772 26.2271 63.9376 26.2704C63.7341 27.3174 60.6312 28.5325 58.7426 29.0302L58.4561 29.1258L58.5517 29.4123C59.4857 32.7352 59.9962 35.869 59.5512 36.1375C58.8051 36.1701 55.8437 33.0187 53.4266 29.9682L53.25 29.7267L53.0085 29.9034C51.4769 30.9669 47.0642 33.568 45.2004 32.7358C45.1156 32.698 45.0726 32.6583 45.069 32.5754C44.9031 31.6275 47.4365 28.7762 49.0687 27.1685L49.3065 26.9089L49.047 26.6711C47.0642 25.0135 44.9 22.9901 44.4979 22.3432C45.28 22.1845 48.6138 22.4543 51.663 22.8611L51.8703 22.852L51.9874 22.6808C53.5637 19.7881 55.2861 17.3875 55.7853 17.4072L55.7475 17.4919Z" fill="black"/>
      <path d="M48.4732 20.1765C48.639 20.1692 48.7994 20.0376 48.7903 19.8304C48.7632 19.2086 47.7681 16.3868 47.6724 16.1002C47.6239 15.9362 47.4544 15.8606 47.2902 15.9093C47.1266 15.9579 47.0508 16.1274 47.0993 16.2914C47.5231 17.4356 48.192 19.4412 48.21 19.8557C48.2281 20.2702 48.3489 20.1819 48.5561 20.1728L48.4732 20.1765Z" fill="black"/>
      <path d="M46.6765 20.8775C46.7595 20.8739 46.842 20.8703 46.8801 20.7856C46.9989 20.6559 46.9899 20.4486 46.8602 20.3297L45.2958 18.7369C45.1656 18.618 44.9585 18.627 44.8397 18.7568C44.7209 18.8866 44.7299 19.0938 44.8596 19.2128L46.424 20.8055C46.4693 20.8866 46.5936 20.8812 46.6765 20.8775Z" fill="black"/>
      <path d="M63.2444 30.3702L65.9385 30.2526C66.1044 30.2454 66.2647 30.1138 66.2557 29.9066C66.2466 29.6993 66.1168 29.5804 65.9096 29.5894L63.2155 29.707C63.0498 29.7142 62.8894 29.8458 62.8984 30.0531C62.9075 30.2603 63.0372 30.3792 63.2444 30.3702Z" fill="black"/>
      <path d="M65.702 34.3327C65.8264 34.3272 65.9471 34.2389 65.9813 34.0713C66.0155 33.9037 65.9254 33.7416 65.7578 33.7073C65.255 33.6047 63.7987 32.5886 63.0256 31.9994C62.8958 31.8805 62.6903 31.931 62.5696 32.0193C62.4507 32.1491 62.5012 32.3545 62.5895 32.4752C62.804 32.632 64.7793 34.1238 65.5759 34.2966L65.6588 34.293L65.702 34.3327Z" fill="black"/>
      <path d="M20.9693 92.1799C20.7439 88.9092 21.4674 85.5139 23.3447 82.8573C25.5752 79.7283 29.2333 77.9074 32.9743 77.0383C36.0574 76.3223 39.2474 76.1417 42.4138 76.3774C47.9119 76.7602 52.6013 79.5454 58.0384 80.4292C58.5393 80.4904 59.0421 80.5934 59.5017 80.656C62.34 80.9891 65.3261 80.9001 67.9335 79.7484C70.5409 78.5962 71.6094 77.3871 72.7336 75.5524C73.8578 73.7177 74.5531 71.5692 75.0014 69.4733C75.8585 65.3249 75.2433 60.7425 74.3596 56.6697C74.1522 55.7234 73.9375 54.6117 73.3644 53.8477C71.8232 51.8386 68.4764 49.3687 68.1984 46.8061L71.2927 47.294C71.0854 47.303 70.6708 46.366 70.5392 46.2056C70.1823 45.6398 69.8254 45.074 69.5099 44.5064C68.8357 43.3316 68.2823 42.0684 68.1001 40.7475C68.0405 40.3348 67.9792 39.8807 68.0873 39.5023C68.1953 39.1238 68.4674 38.6967 68.8764 38.5542C69.3251 38.3685 69.8712 38.5108 70.2605 38.8675C70.6498 39.2243 70.8751 39.6298 71.1419 40.0334C71.4087 40.437 71.6358 40.8838 71.9819 41.201C72.8884 41.992 74.6761 42.0385 74.6506 40.5031C74.6344 40.1301 73.9386 39.413 74.0071 39.0778L75.4209 34.3651C75.3507 34.6588 77.6037 36.8029 77.8217 37.0426C79.7991 39.531 81.4953 42.2392 82.9068 45.0845C89.2757 57.8043 90.0729 73.2176 84.7932 86.4041C79.5134 99.591 83.7647 89.4806 83.516 89.4915" fill="white"/>
      <path d="M83.5698 89.7798C83.86 89.7672 84.0203 89.6357 84.9426 86.979C85.0164 86.7682 85.0921 86.5991 85.0885 86.5161C90.3286 73.3722 89.6502 57.8293 83.1912 44.9475C81.6914 41.9815 79.9952 39.2732 78.0612 36.8245C77.9746 36.7452 77.7998 36.5452 77.4537 36.2281C76.9761 35.7506 75.846 34.5957 75.709 34.3109C75.7036 34.1866 75.6152 34.0659 75.4891 34.0299C75.3215 33.9957 75.1575 34.0443 75.1251 34.2534C75.1287 34.3363 73.7113 38.9661 73.7113 38.9661C73.641 39.2598 73.8213 39.5842 74.0448 39.9482C74.135 40.1103 74.3134 40.3932 74.317 40.4761C74.3351 40.8906 74.182 41.188 73.8558 41.3268C73.3675 41.5557 72.6124 41.381 72.1365 40.945C71.8338 40.6676 71.6084 40.2621 71.3831 39.8567C71.0695 39.3305 70.8441 38.9251 70.4134 38.5701C69.8961 38.1359 69.2671 37.9973 68.7374 38.2281C68.2887 38.4137 67.9337 38.8445 67.7915 39.3906C67.6474 39.8952 67.7105 40.3907 67.7683 40.762C67.945 41.9585 68.4138 43.1839 69.2232 44.6019C69.5819 45.2092 69.9406 45.8165 70.2543 46.3426C70.2543 46.3426 70.2993 46.4237 70.3462 46.5462C70.3931 46.6688 70.4796 46.748 70.5265 46.8706C69.6074 46.7446 68.1855 46.516 68.1855 46.516C68.1026 46.5196 67.9783 46.525 67.9404 46.6097C67.8611 46.6962 67.8233 46.7809 67.8269 46.8638C68.0345 48.7652 69.7738 50.5576 71.3383 52.1505C71.9907 52.8279 72.6 53.4659 73.083 54.0676C73.5679 54.711 73.7771 55.6985 73.9809 56.5617L73.9917 56.8102C75.1747 62.0324 75.3917 66.0512 74.6696 69.4877C74.1528 71.9192 73.4503 73.9013 72.4396 75.4821C71.2739 77.3186 69.6757 78.7589 67.7602 79.5897C65.5186 80.5597 62.7903 80.845 59.451 80.4506C58.9499 80.3894 58.4904 80.3268 57.9894 80.2655C55.6052 79.8712 53.2876 79.1002 51.0528 78.3256C48.2705 77.3673 45.4047 76.4126 42.3213 76.1738C38.9477 75.9472 35.7187 76.1712 32.7993 76.8383C29.7575 77.5525 25.593 79.1878 23.0097 82.7888C21.2094 85.3171 20.3182 88.6783 20.5585 92.2805C20.5658 92.4464 20.6954 92.5652 20.9026 92.5562C21.0686 92.5489 21.1856 92.378 21.1783 92.2121C20.9434 88.7342 21.7988 85.4994 23.5215 83.0985C25.9878 79.6689 30.0294 78.0803 32.9471 77.372C35.8247 76.7063 38.93 76.4876 42.2618 76.716C45.2605 76.9172 48.085 77.8737 50.8259 78.8338C53.0606 79.6085 55.4196 80.3776 57.8453 80.7701C58.3464 80.8314 58.8491 80.9339 59.3501 80.9951C62.7723 81.3854 65.625 81.0947 67.9477 80.0798C69.9857 79.2018 71.6651 77.7167 72.9082 75.7524C73.9567 74.0868 74.6988 72.0611 75.212 69.5472C75.9305 66.0277 75.7514 61.9246 74.5647 56.6194L74.5539 56.3705C74.3068 55.4678 74.0959 54.4386 73.5208 53.6333C73.0378 53.0316 72.4268 52.3524 71.7328 51.6768C70.3847 50.282 68.8634 48.729 68.5046 47.1665C69.3408 47.296 71.1375 47.5499 71.1808 47.5895C71.3466 47.5823 71.5087 47.4921 71.5429 47.3245C71.5375 47.2002 71.4888 47.0362 71.3627 47.0002C71.2329 46.8813 71.0057 46.4344 70.9156 46.2722C70.8688 46.1497 70.8237 46.0686 70.7804 46.029C70.4686 45.5443 70.0684 44.9388 69.7511 44.3298C68.985 42.9513 68.5613 41.807 68.3467 40.6952C68.3322 40.3636 68.2313 39.9527 68.3393 39.5742C68.4492 39.2373 68.6438 38.9381 68.9303 38.8425C69.2565 38.7037 69.6349 38.8118 69.9791 39.0875C70.2819 39.3649 70.5469 39.7271 70.774 40.174C71.0426 40.6191 71.2716 41.1074 71.7005 41.4208C72.3494 42.0154 73.3964 42.2189 74.0884 41.898C74.6181 41.6673 74.928 41.1554 74.8991 40.4923C74.8882 40.2436 74.7098 39.9607 74.5295 39.6363C74.4394 39.4741 74.3042 39.2309 74.2591 39.1498C74.949 36.8773 75.2731 35.7419 75.4947 35.1093C75.8011 35.4697 76.2373 35.949 77.0177 36.7039C77.2772 36.9417 77.4953 37.1814 77.5404 37.2625C79.4294 39.6301 81.1256 42.3384 82.5822 45.2647C88.9529 58.026 89.6222 73.3617 84.4577 86.3361C84.4613 86.4186 84.3857 86.5881 84.2704 86.8007C84.0867 87.3489 83.5337 88.9511 83.2976 89.2516C83.2166 89.297 83.1391 89.4248 83.1445 89.549C83.1517 89.715 83.2833 89.8755 83.4906 89.8664L83.5698 89.7798Z" fill="black"/>
      <path d="M23.8674 34.9125L30.1035 28.4113L30.502 28.9752L30.691 29.5069C30.691 29.5069 27.9632 31.7022 29.524 33.2121C31.0848 34.722 32.6448 31.4564 33.0375 30.9409C33.4307 30.4254 34.3493 29.5964 35.1603 30.1008C35.9714 30.6053 35.296 33.2094 33.8781 34.9739C32.4602 36.7384 29.4694 39.5681 29.4694 39.5681" fill="white"/>
      <path d="M28.0309 41.8319C28.1139 41.8283 28.1968 41.8247 28.2349 41.74L28.7518 41.2191C30.2976 39.5321 31.6058 38.1046 32.8346 36.7637C33.9822 35.4678 35.168 34.0872 35.6324 32.3643C35.7767 31.8597 36.1713 30.4306 35.3185 29.9279C34.4227 29.3856 33.412 30.0111 32.7831 30.8276C32.7038 30.9141 32.6285 31.0835 32.4716 31.298C32.0843 31.9378 31.2282 33.2625 30.4443 33.3798C30.1958 33.3906 29.9433 33.3185 29.7252 33.0789C29.4641 32.7996 29.3273 32.5149 29.311 32.1419C29.298 30.8966 30.8133 29.4601 30.8115 29.4187C30.9303 29.2889 30.9231 29.1231 30.7916 28.9628C30.662 28.8438 30.496 28.8511 30.3355 28.9827C30.2561 29.0692 28.622 30.6355 28.6459 32.1294C28.6694 32.6682 28.8552 33.1169 29.246 33.5151C29.6354 33.8719 30.0588 34.061 30.4714 34.0014C31.5455 33.8715 32.4393 32.4621 32.9435 31.6511C33.061 31.4799 33.1367 31.3105 33.1761 31.2672C33.333 31.0528 34.2032 30.0596 34.8864 30.4866C35.099 30.6019 35.2413 31.011 34.9206 32.2292C34.4508 33.8278 33.3462 35.1633 32.2362 36.3745C31.0073 37.7155 29.7409 39.1411 28.1534 40.83L27.6365 41.3508C27.5172 41.4806 27.5263 41.6878 27.6564 41.8068C27.6995 41.8464 27.7843 41.8842 27.8672 41.8806L28.0309 41.8319Z" fill="black"/>
    </svg>
  )
}

/* ════════════════════════════════════════
   GoalDetail Page
   ════════════════════════════════════════ */
export default function GoalDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [goal,          setGoal]          = useState(() => loadGoal(id))
  const [selectedDate,  setSelectedDate]  = useState(getTodayISO)
  const [selectedValue, setSelectedValue] = useState(null)

  // 3-dot menu
  const [menuOpen,      setMenuOpen]      = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Add reason
  const [addingReason,  setAddingReason]  = useState(false)
  const [reasonInput,   setReasonInput]   = useState('')

  // Edit mode
  const [isEditing,    setIsEditing]    = useState(false)
  const [editValues,   setEditValues]   = useState([])
  const [regenLoading, setRegenLoading] = useState(false)

  const menuRef  = useRef(null)
  const stripRef = useRef(null)

  const days = generateDayRange()

  // Scroll strip to today (rightmost) on mount
  useEffect(() => {
    if (stripRef.current) {
      stripRef.current.scrollLeft = stripRef.current.scrollWidth
    }
  }, [])

  // Close 3-dot menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  if (!goal) {
    return (
      <div className="gd-not-found">
        <p className="gd-not-found__text">This goal couldn't be found.</p>
        <button className="gd-not-found__btn" onClick={() => navigate('/goals')}>
          Back to Goals
        </button>
      </div>
    )
  }

  const isPaused       = goal.status === 'paused'
  const entries        = loadEntriesForGoal(goal.id)
  const loggedSet      = new Set(entries.map(e => e.date))
  const selectedEntry  = entries.find(e => e.date === selectedDate) ?? null
  const alignedValues  = goal.alignedValues ?? []
  const valueSummaries = goal.valueSummaries ?? {}
  const reasons        = goal.reasons ?? []

  // Build value pool for edit mode
  const userValuesData = loadUserValues()
  const userValuePool  = [...new Set([
    ...(userValuesData.top3  ?? []),
    ...(userValuesData.top10 ?? []),
    ...alignedValues,
  ])]
  const valuePool = userValuePool.length > 0 ? userValuePool : FALLBACK_VALUES

  const MoodFaceComp = selectedEntry?.mood ? MOOD_FACES[selectedEntry.mood] : null

  /* ── Handlers ── */

  function handleDayClick(day) {
    setSelectedDate(day.iso)
    setSelectedValue(null)
  }

  function handleValueChipClick(value) {
    setSelectedValue(v => v === value ? null : value)
  }

  function handlePause() {
    const dateLabel = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    const updated = { ...goal, status: 'paused', pausedDate: dateLabel }
    setGoal(updated)
    saveGoal(updated)
    setMenuOpen(false)
  }

  function handleUnpause() {
    const updated = { ...goal, status: 'active', pausedDate: null }
    setGoal(updated)
    saveGoal(updated)
    setMenuOpen(false)
  }

  function handleDelete() {
    try {
      const goals = JSON.parse(localStorage.getItem('trumi_goals') ?? '[]')
      localStorage.setItem('trumi_goals', JSON.stringify(
        goals.filter(g => String(g.id) !== String(goal.id))
      ))
    } catch { /* noop */ }
    navigate('/goals')
  }

  function handleAddReason() {
    const trimmed = reasonInput.trim()
    if (!trimmed) { setAddingReason(false); return }
    const updated = { ...goal, reasons: [...reasons, trimmed] }
    setGoal(updated)
    saveGoal(updated)
    setReasonInput('')
    setAddingReason(false)
  }

  function handleDeleteReason(index) {
    const updated = { ...goal, reasons: reasons.filter((_, i) => i !== index) }
    setGoal(updated)
    saveGoal(updated)
  }

  function handleEditGoal() {
    setEditValues([...alignedValues])
    setIsEditing(true)
    setMenuOpen(false)
  }

  function toggleEditValue(v) {
    setEditValues(prev =>
      prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]
    )
  }

  async function handleSaveEdits() {
    const valuesChanged =
      JSON.stringify([...editValues].sort()) !== JSON.stringify([...alignedValues].sort())

    if (valuesChanged) {
      setRegenLoading(true)
      try {
        const { alignedValues: newAligned, summaries } = await getValueAlignment({
          goalTitle: goal.title,
          values:    editValues,
        })
        const updated = { ...goal, alignedValues: newAligned, valueSummaries: summaries }
        setGoal(updated)
        saveGoal(updated)
      } catch {
        // If AI fails, save the user's manual selection without summaries
        const updated = { ...goal, alignedValues: editValues, valueSummaries: {} }
        setGoal(updated)
        saveGoal(updated)
      } finally {
        setRegenLoading(false)
      }
    }

    setIsEditing(false)
    setSelectedValue(null)
  }

  function scrollStrip(dir) {
    stripRef.current?.scrollBy({ left: dir * 160, behavior: 'smooth' })
  }

  /* ── Render ── */

  return (
    <div className="gd-page">

      {/* ── Nav row: back + title + 3-dot menu or Done ── */}
      <div className="gd-nav">
        <button className="gd-nav__back" onClick={() => navigate(-1)} aria-label="Go back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <h1 className="gd-nav__title">{goal.title}</h1>

        {isEditing ? (
          <button
            className={`gd-nav__done-btn${regenLoading ? ' gd-nav__done-btn--loading' : ''}`}
            onClick={handleSaveEdits}
            disabled={regenLoading}
          >
            {regenLoading ? 'Saving…' : 'Done'}
          </button>
        ) : (
          <div className="gd-nav__menu-wrap" ref={menuRef}>
            <button
              className="gd-nav__menu-btn"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Goal options"
              aria-expanded={menuOpen}
            >
              <svg width="20" height="4" viewBox="0 0 20 4" fill="none" aria-hidden="true">
                <circle cx="2"  cy="2" r="2" fill="#292952"/>
                <circle cx="10" cy="2" r="2" fill="#292952"/>
                <circle cx="18" cy="2" r="2" fill="#292952"/>
              </svg>
            </button>

            {menuOpen && (
              <div className="gd-nav__menu" role="menu">
                <button
                  className="gd-nav__menu-item"
                  role="menuitem"
                  onClick={isPaused ? handleUnpause : handlePause}
                >
                  {isPaused ? 'Resume Goal' : 'Pause Goal'}
                </button>
                <button
                  className="gd-nav__menu-item"
                  role="menuitem"
                  onClick={handleEditGoal}
                >
                  Edit Goal
                </button>
                <button
                  className="gd-nav__menu-item gd-nav__menu-item--danger"
                  role="menuitem"
                  onClick={() => { setMenuOpen(false); setConfirmDelete(true) }}
                >
                  Delete Goal
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Goal Started chip ── */}
      <div className="gd-started-chip">
        Goal Started: <span className="gd-started-chip__date">{goal.startDate}</span>
      </div>

      {/* ── Day picker strip ── */}
      <div className="gd-day-picker">
        <button
          className="gd-day-picker__arrow"
          onClick={() => scrollStrip(-1)}
          aria-label="Scroll to earlier dates"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11.5 14L6.5 9L11.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="gd-day-picker__strip" ref={stripRef}>
          {days.map(day => {
            const logged     = loggedSet.has(day.iso)
            const isSelected = day.iso === selectedDate
            return (
              <div key={day.iso} className="gd-day-picker__col">
                <span className="gd-day-picker__label">{day.dayLabel}</span>
                <button
                  className={[
                    'gd-day-picker__cell',
                    logged      ? 'gd-day-picker__cell--logged'   : '',
                    day.isToday ? 'gd-day-picker__cell--today'    : '',
                    isSelected  ? 'gd-day-picker__cell--selected' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => handleDayClick(day)}
                  aria-pressed={isSelected}
                >
                  {day.dayNum}
                </button>
                {day.isToday && (
                  <span className="gd-day-picker__today-label">Today</span>
                )}
              </div>
            )
          })}
        </div>

        <button
          className="gd-day-picker__arrow"
          onClick={() => scrollStrip(1)}
          aria-label="Scroll to later dates"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M6.5 14L11.5 9L6.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* ── Log Information (only when entry exists for selected date) ── */}
      {selectedEntry && (
        <section className="gd-log-section">
          <h2 className="gd-log-section__heading">Log Information:</h2>
          <div className="gd-log-card">
            <div className="gd-log-card__top">
              <div className="gd-log-card__face">
                {MoodFaceComp && <MoodFaceComp />}
              </div>
              <div className="gd-log-card__contrib-pill">
                Contribution: {CONTRIBUTION_LABELS[selectedEntry.contribution] ?? selectedEntry.contribution}
              </div>
            </div>
            {selectedEntry.summary && (
              <p className="gd-log-card__summary">{selectedEntry.summary}</p>
            )}
          </div>
        </section>
      )}

      {/* ── Divider ── */}
      <div className="gd-divider" />

      {/* ── This Goal Supports Your Values ── */}
      <section className="gd-values-section">
        <div className="gd-values-section__banner-row">
          <ValuesCharacter />
          <div className="gd-values-section__banner">
            This Goal Supports your Values
          </div>
        </div>

        {isEditing ? (
          /* Edit mode: toggle which values align with this goal */
          <div className="gd-values-section__edit">
            <p className="gd-values-section__edit-label">
              Select the values this goal supports:
            </p>
            <div className="gd-values-section__edit-chips">
              {valuePool.map(v => (
                <button
                  key={v}
                  className={`gd-values-section__edit-chip${editValues.includes(v) ? ' gd-values-section__edit-chip--on' : ''}`}
                  onClick={() => toggleEditValue(v)}
                >
                  {v}
                </button>
              ))}
            </div>
            {regenLoading && (
              <p className="gd-values-section__regen-note">
                Updating your value summaries…
              </p>
            )}
          </div>
        ) : (
          <>
            {alignedValues.length > 0 && (
              <div className="gd-values-section__chips">
                {alignedValues.map(v => (
                  <button
                    key={v}
                    className={`gd-values-section__chip${selectedValue === v ? ' gd-values-section__chip--active' : ''}`}
                    onClick={() => handleValueChipClick(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            )}
            {selectedValue && valueSummaries[selectedValue] && (
              <p className="gd-values-section__value-summary">
                {valueSummaries[selectedValue]}
              </p>
            )}
          </>
        )}
      </section>

      {/* ── Divider ── */}
      <div className="gd-divider" />

      {/* ── Your Why ── */}
      <section className="gd-why-section">
        <h2 className="gd-why-section__heading">Your Why</h2>

        {reasons.length > 0 && (
          <div className="gd-why-section__chips">
            {reasons.map((r, i) => (
              <span key={i} className={`gd-why-section__chip${isEditing ? ' gd-why-section__chip--editing' : ''}`}>
                {r}
                {isEditing && (
                  <button
                    className="gd-why-section__chip-delete"
                    onClick={() => handleDeleteReason(i)}
                    aria-label={`Remove "${r}"`}
                  >
                    ✕
                  </button>
                )}
              </span>
            ))}
          </div>
        )}

        {addingReason ? (
          <div className="gd-why-section__add-form">
            <input
              className="gd-why-section__add-input"
              type="text"
              value={reasonInput}
              onChange={e => setReasonInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddReason()}
              placeholder="e.g. I want to feel stronger"
              autoFocus
              maxLength={80}
            />
            <button className="gd-why-section__add-save" onClick={handleAddReason}>Add</button>
            <button
              className="gd-why-section__add-cancel"
              onClick={() => { setAddingReason(false); setReasonInput('') }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button className="gd-why-section__add-btn" onClick={() => setAddingReason(true)}>
            Add reason
          </button>
        )}
      </section>

      {/* ── Delete confirmation overlay ── */}
      {confirmDelete && (
        <div className="gd-confirm-overlay" role="dialog" aria-modal="true">
          <div className="gd-confirm-box">
            <p className="gd-confirm-box__title">Delete this goal?</p>
            <p className="gd-confirm-box__body">
              {`"${goal.title}" will be permanently deleted. This can't be undone.`}
            </p>
            <div className="gd-confirm-box__actions">
              <button
                className="gd-confirm-box__btn gd-confirm-box__btn--cancel"
                onClick={() => setConfirmDelete(false)}
              >
                Keep It
              </button>
              <button
                className="gd-confirm-box__btn gd-confirm-box__btn--delete"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
