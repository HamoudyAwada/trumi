import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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

function getTodayISO() {
  return new Date().toISOString().split('T')[0]
}

/** Array of 31 days from 30 days ago → today (today is last / rightmost). */
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
      <path d="M31.8055 24.5998C31.8055 24.5998 -0.0950812 46.2986 15.113 80.7665C15.6664 82.0297 16.3046 83.3305 16.9841 84.63L20.968 92.1802L36.8474 86.8361C36.8474 86.8361 18.2289 57.9567 28.2351 44.6054C30.5237 41.8478 32.5417 41.469 33.0715 39.3281L29.1317 38.5033L31.7624 24.5601L31.8055 24.5998Z" fill="white"/>
      <path d="M20.9826 92.5113L21.0651 92.5077L36.9445 87.1636C37.0275 87.16 37.1068 87.0734 37.1444 86.9886L37.1318 86.6985C36.9532 86.416 18.7223 57.8523 28.5344 44.7997C29.4803 43.6372 30.3631 42.9342 31.1648 42.2764C32.248 41.3985 33.0909 40.7388 33.4479 39.3944L33.437 39.1457C33.3917 39.0647 33.3069 39.0268 33.2226 38.989L29.5766 38.2345L32.1782 24.5832C32.1728 24.4589 32.1674 24.3346 32.0395 24.2571C31.9117 24.1796 31.7875 24.185 31.7081 24.2716C31.627 24.3166 23.6051 29.8576 17.5913 39.5466C12.0023 48.5111 7.0258 62.9307 14.9095 80.8582C15.4647 82.1627 16.1025 83.464 16.7824 84.763L20.7664 92.3131C20.813 92.4356 20.9391 92.4719 21.0633 92.4665L20.9826 92.5113ZM36.3425 86.6916L21.1173 91.7995L17.2689 84.4924C16.5908 83.2346 15.953 81.9338 15.3978 80.6293C7.60794 62.9466 12.5106 48.7381 18.022 39.9015C23.0286 31.876 29.3675 26.7823 31.3784 25.2826L28.8793 38.4311C28.8865 38.5969 28.935 38.7608 29.1027 38.7951L32.707 39.5513C32.3737 40.4795 31.6908 41.0076 30.7287 41.797C29.9665 42.4117 29.0043 43.2012 28.019 44.4069C23.8604 49.9869 24.0099 59.1164 28.508 70.8382C31.4627 78.5991 35.4449 85.1527 36.3819 86.6485L36.3425 86.6916Z" fill="black"/>
      <path d="M40.3732 42.9546C40.3732 42.9546 42.4949 47.8037 37.5227 47.1071C32.5506 46.4105 18.6349 46.3119 23.0674 65.0964L44.1756 55.8697C44.1756 55.8697 47.6551 53.7659 46.0162 48.5636C44.3774 43.3613 40.3314 42.9564 40.3314 42.9564L40.3732 42.9546Z" fill="black"/>
      <path d="M44.5342 55.5212C44.5342 55.5212 42.3611 56.1562 41.26 54.7093C41.26 54.7093 40.0148 56.6324 37.3045 56.3769C34.5942 56.1213 34.2803 53.6848 34.2803 53.6848C34.2803 53.6848 33.9508 56.6064 31.3216 57.2607C28.6924 57.9156 25.4726 60.2569 25.8677 62.6481C25.8948 63.2697 25.3341 62.7959 25.1306 61.9326C24.977 61.2752 23.7428 61.5366 23.3357 61.7207C20.8021 62.6616 21.2097 66.2982 22.4123 68.1559C23.6145 70.0135 23.3312 69.2368 24.009 69.5398C24.009 69.5398 26.0236 79.5425 24.8274 81.6297L50.7552 78.1724C50.7552 78.1724 47.0814 71.0657 46.7275 65.8073C46.3735 60.549 44.493 55.523 44.493 55.523L44.5342 55.5212Z" fill="white"/>
      <path d="M24.8815 81.9178L50.8092 78.4605C50.8921 78.4569 51.0129 78.369 51.0507 78.2842C51.0885 78.1994 51.0831 78.0752 51.038 77.994C51.0344 77.911 47.4058 70.8855 47.0568 65.7514C46.7047 60.5342 44.8223 55.467 44.7775 55.3859C44.729 55.2217 44.5594 55.1465 44.3953 55.195C44.3953 55.195 42.4257 55.7379 41.4579 54.4928C41.4126 54.4116 41.2865 54.3753 41.2035 54.379C41.121 54.3826 40.9982 54.4297 40.9605 54.5145C40.9224 54.5988 39.7911 56.2681 37.2898 56.0447C34.8733 55.8599 34.572 53.7136 34.5684 53.6306C34.5612 53.4647 34.4315 53.3459 34.2656 53.3531C34.0996 53.3603 33.9808 53.49 33.945 53.616C33.9504 53.7407 33.6065 56.3304 31.2243 56.9327C28.761 57.5798 25.5713 59.6709 25.5125 62.1237C25.5089 62.0407 25.4617 61.9179 25.4151 61.7954C25.363 61.5488 25.231 61.3883 25.0184 61.2731C24.3805 60.9271 23.3191 61.3473 23.1949 61.3527C22.2958 61.6827 21.6614 62.3744 21.3281 63.303C20.7771 64.9464 21.2837 67.042 22.0843 68.253C22.4859 68.9001 23.0467 69.3739 23.6827 69.6782C24.2655 72.5595 25.4126 79.8183 24.5261 81.3932C24.4472 81.4798 24.4526 81.604 24.5405 81.7251C24.5859 81.8063 24.7137 81.8834 24.7967 81.8797L24.8815 81.9178ZM50.328 77.9005L25.3499 81.2328C26.0992 78.4179 24.5459 70.4296 24.3388 69.4833C24.3352 69.4003 24.2486 69.3215 24.162 69.2421C23.569 68.9773 23.0517 68.5429 22.695 67.977C21.9847 66.9283 21.5265 64.9968 22.0041 63.5642C22.2617 62.8052 22.7768 62.2431 23.4723 62.0047C23.84 61.8642 24.4997 61.7523 24.7971 61.9055C24.8384 61.9037 24.8832 61.9849 24.885 62.0262C25.0387 62.684 25.399 63.3329 25.8533 63.2712C25.9363 63.2676 26.2641 63.1702 26.2424 62.6728L26.2406 62.6316C25.894 60.4041 29.0366 58.1905 31.4605 57.5865C33.2265 57.136 33.9973 55.7732 34.3701 54.8021C34.7794 55.6146 35.6104 56.575 37.3187 56.708C39.528 56.9023 40.8076 55.7667 41.3227 55.2046C42.3196 56.1577 43.7663 56.0114 44.3848 55.9013C44.765 57.0058 46.2004 61.3453 46.52 65.8161C46.845 70.4112 49.5941 76.3127 50.3692 77.8987L50.328 77.9005Z" fill="black"/>
      <path d="M79.7217 15.906C79.7217 15.906 41.7556 7.09824 35.6539 7.15688L28.8198 38.0188L71.6931 46.9862C71.6931 46.9862 79.6541 21.0167 79.7217 15.906Z" fill="#6666CC"/>
      <path d="M71.874 47.3105L71.946 47.0582C72.2738 46.0057 79.9448 21.004 80.0124 15.8933L80.0016 15.6446L79.7908 15.5708C78.2391 15.2232 41.6984 6.72695 35.638 6.78381L35.3896 6.79466L28.4548 38.2008L71.9136 47.2672L71.874 47.3105ZM79.3998 16.1276C79.1303 21.3718 72.3041 43.845 71.4684 46.5807L29.1825 37.7538L35.8742 7.43792C42.2773 7.61525 76.1289 15.3983 79.3998 16.1276Z" fill="black"/>
      <path d="M74.334 19.0062C74.334 19.0062 42.2735 12.3077 39.6122 12.2162L34.296 35.0388L68.69 41.9261L74.3755 19.0044L74.334 19.0062Z" fill="white"/>
      <path d="M55.8181 17.1987C56.9103 17.4832 57.87 24.2517 57.87 24.2517C57.87 24.2517 64.619 24.7462 64.2751 26.3807C63.9311 28.0153 58.8404 29.3587 58.8404 29.3587C58.8404 29.3587 60.8942 36.4531 59.5661 36.4696C58.2379 36.486 53.1874 30.1868 53.1874 30.1868C53.1874 30.1868 47.5041 34.1306 45.0895 33.0318C42.6745 31.9329 48.8528 26.9707 48.8528 26.9707C48.8528 26.9707 43.9395 22.8664 44.1631 22.2752C44.3862 21.6842 51.7373 22.6507 51.7373 22.6507C51.7373 22.6507 54.8521 16.9501 55.8596 17.1968L55.8181 17.1987Z" fill="#6666CC"/>
      <path d="M20.9683 92.1801C20.7429 88.9094 21.4664 85.5141 23.3437 82.8575C25.5743 79.7285 29.2324 77.9077 32.9733 77.0385C36.0564 76.3225 39.2464 76.142 42.4128 76.3776C47.9109 76.7604 52.6003 79.5456 58.0374 80.4294C58.5384 80.4907 59.0412 80.5937 59.5007 80.6563C62.3391 80.9894 65.3251 80.9004 67.9325 79.7486C70.54 78.5964 71.6084 77.3874 72.7326 75.5527C73.8568 73.7179 74.5521 71.5694 75.0004 69.4735C75.8576 65.3252 75.2423 60.7428 74.3586 56.6699C74.1512 55.7237 73.9366 54.612 73.3634 53.848C71.8222 51.8389 68.4754 49.3689 68.1974 46.8063L71.2917 47.2942C71.0845 47.3032 70.6698 46.3662 70.5383 46.2059C70.1813 45.6401 69.8244 45.0743 69.5089 44.5067C68.8348 43.3318 68.2813 42.0686 68.0991 40.7477C68.0396 40.3351 67.9782 39.8809 68.0863 39.5025C68.1943 39.124 68.4664 38.6969 68.8755 38.5544C69.3242 38.3688 69.8702 38.511 70.2595 38.8678C70.6488 39.2246 70.8741 39.63 71.1409 40.0336C71.4077 40.4372 71.6349 40.8841 71.9809 41.2012C72.8875 41.9922 74.6752 42.0387 74.6497 40.5034C74.6334 40.1304 73.9377 39.4132 74.0061 39.078L75.42 34.3653C75.3497 34.6591 77.6027 36.8032 77.8208 37.0428C79.7981 39.5312 81.4943 42.2395 82.9058 45.0848C89.2747 57.8046 90.0719 73.2179 84.7922 86.4043C79.5124 99.5913 83.7637 89.4809 83.515 89.4917" fill="white"/>
      <path d="M83.5689 89.7801C83.859 89.7674 84.0194 89.636 84.9416 86.9792C85.0154 86.7684 85.0911 86.5993 85.0875 86.5164C90.3276 73.3725 89.6493 57.8296 83.1902 44.9477C81.6904 41.9817 79.9942 39.2734 78.0602 36.8247C77.9736 36.7455 77.7988 36.5455 77.4528 36.2283C76.9751 35.7509 75.845 34.5959 75.708 34.3112C75.7026 34.1869 75.6143 34.0661 75.4881 34.0301C75.3205 33.9959 75.1565 34.0446 75.1241 34.2536C75.1278 34.3365 73.7103 38.9663 73.7103 38.9663C73.64 39.2601 73.8203 39.5844 74.0438 39.9484C74.134 40.1106 74.3124 40.3935 74.316 40.4764C74.3341 40.8909 74.181 41.1882 73.8548 41.327C73.3665 41.556 72.6114 41.3813 72.1356 40.9453C71.8328 40.6678 71.6074 40.2624 71.3821 39.8569C71.0685 39.3308 70.8431 38.9253 70.4124 38.5704C69.8951 38.1362 69.2662 37.9976 68.7364 38.2283C68.2877 38.414 67.9328 38.8447 67.7905 39.3908C67.6464 39.8954 67.7096 40.391 67.7673 40.7622C67.9441 41.9587 68.4128 43.1841 69.2222 44.6022C69.5809 45.2094 69.9397 45.8167 70.2533 46.3428C70.2533 46.3428 70.2983 46.424 70.3452 46.5465C70.3921 46.669 70.4786 46.7483 70.5255 46.8708C69.6064 46.7448 68.1845 46.5162 68.1845 46.5162C68.1016 46.5198 67.9773 46.5253 67.9394 46.6099C67.8602 46.6964 67.8223 46.7812 67.826 46.864C68.0335 48.7654 69.7728 50.5578 71.3373 52.1507C71.9897 52.8282 72.599 53.4661 73.082 54.0678C73.5669 54.7112 73.7761 55.6987 73.9799 56.562L73.9908 56.8104C75.1738 62.0326 75.3907 66.0514 74.6686 69.488C74.1518 71.9194 73.4493 73.9015 72.4386 75.4824C71.2729 77.3189 69.6748 78.7591 67.7593 79.5899C65.5176 80.5599 62.7893 80.8452 59.45 80.4509C58.949 80.3896 58.4894 80.327 57.9884 80.2657C55.6042 79.8715 53.2866 79.1005 51.0519 78.3259C48.2695 77.3675 45.4037 76.4129 42.3203 76.1741C38.9467 75.9474 35.7177 76.1715 32.7983 76.8385C29.7565 77.5527 25.592 79.1881 23.0087 82.789C21.2085 85.3173 20.3172 88.6786 20.5576 92.2807C20.5648 92.4467 20.6945 92.5655 20.9017 92.5564C21.0676 92.5492 21.1846 92.3783 21.1774 92.2123C20.9424 88.7344 21.7979 85.4996 23.5205 83.0987C25.9869 79.6692 30.0285 78.0805 32.9461 77.3722C35.8238 76.7065 38.929 76.4878 42.2609 76.7163C45.2595 76.9175 48.084 77.8739 50.8249 78.8341C53.0596 79.6087 55.4187 80.3779 57.8443 80.7703C58.3454 80.8316 58.8482 80.9341 59.3491 80.9954C62.7714 81.3857 65.624 81.0949 67.9468 80.08C69.9848 79.2021 71.6641 77.717 72.9072 75.7526C73.9557 74.087 74.6979 72.0614 75.2111 69.5474C75.9295 66.0279 75.7504 61.9248 74.5638 56.6196L74.5529 56.3707C74.3059 55.468 74.0949 54.4388 73.5199 53.6335C73.0368 53.0319 72.4258 52.3526 71.7319 51.677C70.3837 50.2822 68.8625 48.7293 68.5036 47.1667C69.3398 47.2963 71.1365 47.5501 71.1798 47.5897C71.3456 47.5825 71.5077 47.4924 71.5419 47.3248C71.5365 47.2004 71.4878 47.0365 71.3617 47.0004C71.2319 46.8815 71.0048 46.4346 70.9146 46.2725C70.8678 46.1499 70.8227 46.0688 70.7794 46.0292C70.4676 45.5445 70.0674 44.9391 69.7502 44.33C68.9841 42.9515 68.5604 41.8073 68.3457 40.6954C68.3313 40.3638 68.2303 39.953 68.3384 39.5745C68.4482 39.2375 68.6428 38.9383 68.9293 38.8428C69.2555 38.704 69.6339 38.812 69.9782 39.0877C70.2809 39.3652 70.5459 39.7273 70.7731 40.1742C71.0416 40.6193 71.2706 41.1076 71.6995 41.4211C72.3484 42.0157 73.3955 42.2191 74.0874 41.8983C74.6172 41.6675 74.9271 41.1557 74.8981 40.4925C74.8873 40.2438 74.7088 39.9609 74.5285 39.6366C74.4384 39.4744 74.3032 39.2311 74.2581 39.1501C74.948 36.8775 75.2721 35.7421 75.4937 35.1096C75.8001 35.4699 76.2363 35.9492 77.0167 36.7041C77.2763 36.942 77.4944 37.1817 77.5394 37.2627C79.4284 39.6304 81.1246 42.3386 82.5812 45.265C88.9519 58.0263 89.6212 73.362 84.4568 86.3363C84.4604 86.4188 84.3847 86.5884 84.2694 86.801C84.0857 87.3491 83.5327 88.9513 83.2967 89.2519C83.2156 89.2972 83.1381 89.425 83.1435 89.5493C83.1508 89.7152 83.2824 89.8757 83.4896 89.8667L83.5689 89.7801Z" fill="black"/>
      <path d="M23.8674 34.9125L30.1035 28.4113L30.502 28.9752L30.691 29.5069C30.691 29.5069 27.9632 31.7022 29.524 33.2121C31.0848 34.722 32.6448 31.4564 33.0375 30.9409C33.4307 30.4254 34.3493 29.5964 35.1603 30.1008C35.9714 30.6053 35.296 33.2094 33.8781 34.9739C32.4602 36.7384 29.4694 39.5681 29.4694 39.5681" fill="white"/>
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
  const [menuOpen,       setMenuOpen]     = useState(false)
  const [confirmDelete,  setConfirmDelete] = useState(false)
  const [addingReason,   setAddingReason]  = useState(false)
  const [reasonInput,    setReasonInput]   = useState('')

  const menuRef  = useRef(null)
  const stripRef = useRef(null)

  const days = generateDayRange()

  // Scroll day strip to today (rightmost) on mount
  useEffect(() => {
    if (stripRef.current) {
      stripRef.current.scrollLeft = stripRef.current.scrollWidth
    }
  }, [])

  // Close 3-dot menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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

  const isPaused      = goal.status === 'paused'
  const entries       = loadEntriesForGoal(goal.id)
  const loggedSet     = new Set(entries.map(e => e.date))
  const selectedEntry = entries.find(e => e.date === selectedDate) ?? null
  const alignedValues = goal.alignedValues ?? []
  const valueSummaries = goal.valueSummaries ?? {}
  const reasons       = goal.reasons ?? []

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

  function scrollStrip(dir) {
    stripRef.current?.scrollBy({ left: dir * 160, behavior: 'smooth' })
  }

  /* ── Render ── */

  return (
    <div className="gd-page">

      {/* ── Nav row: back + title + 3-dot menu ── */}
      <div className="gd-nav">
        <button className="gd-nav__back" onClick={() => navigate(-1)} aria-label="Go back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <h1 className="gd-nav__title">{goal.title}</h1>

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
                onClick={() => { setMenuOpen(false); navigate(`/edit-goal/${goal.id}`) }}
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
                    logged              ? 'gd-day-picker__cell--logged'   : '',
                    day.isToday         ? 'gd-day-picker__cell--today'    : '',
                    isSelected          ? 'gd-day-picker__cell--selected' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => handleDayClick(day)}
                  aria-label={`${day.dayLabel} ${day.dayNum}${day.isToday ? ', Today' : ''}`}
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
      </section>

      {/* ── Divider ── */}
      <div className="gd-divider" />

      {/* ── Your Why ── */}
      <section className="gd-why-section">
        <h2 className="gd-why-section__heading">Your Why</h2>

        {reasons.length > 0 && (
          <div className="gd-why-section__chips">
            {reasons.map((r, i) => (
              <span key={i} className="gd-why-section__chip">{r}</span>
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
