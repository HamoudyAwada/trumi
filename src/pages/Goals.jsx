import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import GoalCard from '../components/goals/GoalCard'
import { getGoalMeta, getGoalInsight } from '../services/ai'
import './Goals.css'

/* ── Bullseye + arrows icon ── */
function BullseyeIcon() {
  return (
    <svg className="goals-bullseye__icon" width="99" height="67" viewBox="0 0 99 67" fill="none" aria-hidden="true">
      <path d="M89.8525 32.4275L79.9304 48.5822" stroke="#5252A3" strokeWidth="1.59048" strokeLinecap="round"/>
      <path d="M90.7446 27.4184L88.1972 31.3565L88.9346 33.8456L91.71 33.1842L94.2575 29.2462L91.4851 29.9179L90.7446 27.4184Z" fill="#5252A3" stroke="#6666CC" strokeWidth="0.646131" strokeLinecap="square" strokeLinejoin="round"/>
      <path d="M6.40719 38.6247L4.88211 46.5058" stroke="#5252A3" strokeWidth="0.689788" strokeLinecap="round"/>
      <path d="M5.98386 36.457L5.55929 38.3945L6.2536 39.3218L7.28757 38.6991L7.71214 36.7616L6.68108 37.3882L5.98386 36.457Z" fill="#5252A3" stroke="#6666CC" strokeWidth="0.280226" strokeLinecap="square" strokeLinejoin="round"/>
      <path d="M49.6016 60.1385C45.0399 56.3255 43.8995 52.7244 43.8995 51.4004C43.5431 52.9891 43.0442 56.6433 43.8995 58.5498C44.9686 60.9329 40.2746 58.249 39.2666 56.5638C37.8411 54.1807 41.0485 60.1385 34.6336 59.3442C30.0285 58.7739 28.8097 56.0287 28.8656 53.7491C28.9093 53.4838 28.9316 53.2289 28.9316 52.9891C28.895 53.2337 28.8719 53.4884 28.8656 53.7491C28.4605 56.2077 26.2185 59.5649 22.8731 60.1385H49.6016Z" fill="#8585D6"/>
      <path d="M49.6016 60.1385L49.9312 59.7442C50.0971 59.8829 50.1585 60.1106 50.0847 60.3139C50.011 60.5172 49.8178 60.6525 49.6016 60.6525V60.1385ZM43.8995 51.4004L43.398 51.2879C43.4553 51.0323 43.6957 50.8607 43.9561 50.8895C44.2165 50.9184 44.4135 51.1384 44.4135 51.4004H43.8995ZM43.8995 58.5498L43.4305 58.7602V58.7602L43.8995 58.5498ZM39.2666 56.5638L38.8255 56.8277V56.8277L39.2666 56.5638ZM34.6336 59.3442L34.5705 59.8543V59.8543L34.6336 59.3442ZM28.9316 52.9891L28.4232 52.9131C28.463 52.647 28.7013 52.4566 28.9697 52.4766C29.238 52.4965 29.4456 52.7201 29.4456 52.9891H28.9316ZM22.8731 60.1385V60.6525C22.6062 60.6525 22.3836 60.4481 22.361 60.1821C22.3383 59.9161 22.5231 59.677 22.7863 59.6319L22.8731 60.1385ZM49.6016 60.1385L49.2719 60.5329C44.6364 56.6582 43.3855 52.925 43.3855 51.4004H43.8995H44.4135C44.4135 52.5237 45.4434 55.9929 49.9312 59.7442L49.6016 60.1385ZM43.8995 51.4004L44.401 51.5129C44.2285 52.2822 44.0194 53.563 43.9586 54.8796C43.8968 56.2165 43.9932 57.5029 44.3685 58.3394L43.8995 58.5498L43.4305 58.7602C42.9505 57.6902 42.8687 56.1962 42.9317 54.8322C42.9956 53.448 43.2141 52.1074 43.398 51.2879L43.8995 51.4004ZM43.8995 58.5498L44.3685 58.3394C44.5128 58.6612 44.6116 59.0006 44.5542 59.3113C44.5225 59.4825 44.4425 59.6466 44.3026 59.7748C44.167 59.8991 44.0076 59.96 43.863 59.9871C43.5902 60.0381 43.2901 59.9841 43.0246 59.9063C42.7455 59.8244 42.4406 59.6966 42.1318 59.542C41.5136 59.2325 40.8356 58.7933 40.2453 58.3218C39.6641 57.8576 39.1248 57.3281 38.8255 56.8277L39.2666 56.5638L39.7077 56.3C39.9124 56.6422 40.3378 57.0801 40.8868 57.5186C41.4267 57.9498 42.0444 58.3486 42.5921 58.6228C42.8662 58.76 43.1119 58.8606 43.3138 58.9198C43.5294 58.983 43.6412 58.9827 43.6738 58.9766C43.682 58.9751 43.6487 58.9797 43.6081 59.0169C43.5631 59.0581 43.547 59.1045 43.5433 59.1243C43.5418 59.1322 43.5535 59.0342 43.4305 58.7602L43.8995 58.5498ZM39.2666 56.5638L38.8255 56.8277C38.7368 56.6795 38.6695 56.5693 38.6181 56.4895C38.5613 56.4015 38.5404 56.3768 38.5427 56.3793C38.5454 56.3822 38.5554 56.3929 38.5721 56.4068C38.587 56.4192 38.6216 56.4462 38.6742 56.4696C38.7272 56.4932 38.824 56.5243 38.9462 56.5059C39.0785 56.486 39.1795 56.4175 39.2444 56.344C39.302 56.2789 39.3275 56.2152 39.338 56.1847C39.3495 56.1512 39.3538 56.1254 39.3554 56.1148C39.3584 56.0946 39.3574 56.0871 39.3574 56.1046C39.3574 56.2225 39.426 56.8427 39.3284 57.441C39.2246 58.0775 38.9271 58.826 38.1455 59.3394C37.379 59.8428 36.2356 60.0605 34.5705 59.8543L34.6336 59.3442L34.6968 58.834C36.2391 59.025 37.1004 58.7959 37.5812 58.4801C38.0468 58.1743 38.2395 57.7312 38.3138 57.2755C38.3944 56.7814 38.3294 56.4087 38.3294 56.1046C38.3294 56.0693 38.3305 56.018 38.3385 55.9638C38.3427 55.9352 38.3618 55.7903 38.4743 55.6631C38.5452 55.5829 38.6531 55.5104 38.7933 55.4893C38.9234 55.4697 39.0293 55.5024 39.0924 55.5305C39.2037 55.5801 39.2754 55.6572 39.3 55.684C39.3635 55.7532 39.4261 55.8457 39.4821 55.9326C39.5435 56.0277 39.6182 56.1503 39.7077 56.3L39.2666 56.5638ZM34.6336 59.3442L34.5705 59.8543C32.1715 59.5572 30.5836 58.6826 29.6077 57.5177C28.6357 56.3574 28.3215 54.9694 28.3517 53.7365L28.8656 53.7491L29.3794 53.7617C29.3538 54.8084 29.6211 55.9328 30.3957 56.8575C31.1666 57.7777 32.4907 58.5608 34.6968 58.834L34.6336 59.3442ZM28.8656 53.7491L28.3517 53.7365C28.3586 53.4538 28.3836 53.178 28.4232 52.9131L28.9316 52.9891L29.4399 53.0652C29.4064 53.2895 29.3853 53.523 29.3794 53.7617L28.8656 53.7491ZM28.9316 52.9891H29.4456C29.4456 53.2604 29.4204 53.5434 29.3727 53.8327L28.8656 53.7491L28.3584 53.6656C28.3981 53.4242 28.4176 53.1975 28.4176 52.9891H28.9316ZM28.8656 53.7491L29.3727 53.8327C29.1537 55.1623 28.4478 56.7004 27.3646 57.9824C26.2789 59.2674 24.7815 60.3328 22.96 60.6451L22.8731 60.1385L22.7863 59.6319C24.3101 59.3706 25.6063 58.4706 26.5793 57.319C27.5548 56.1644 28.1724 54.7946 28.3584 53.6656L28.8656 53.7491ZM22.8731 60.1385V59.6245H49.6016V60.1385V60.6525H22.8731V60.1385Z" fill="#8585D6"/>
      <path d="M59.8818 60.1385C55.3202 56.3255 54.1798 52.7244 54.1798 51.4004C53.8234 52.9891 52.3065 54.6573 53.1618 56.5638C54.231 58.947 50.5548 58.249 49.5468 56.5638C48.1213 54.1807 51.3287 60.1385 44.9139 59.3442C40.3088 58.7739 39.09 56.0287 39.1458 53.7491C39.1895 53.4838 39.2119 53.2289 39.2119 52.9891C39.1753 53.2337 39.1522 53.4884 39.1458 53.7491C38.7408 56.2077 36.4987 59.5649 33.1534 60.1385H59.8818Z" fill="#8585D6"/>
      <path d="M59.8818 60.1385L60.2115 59.7442C60.3774 59.8829 60.4388 60.1106 60.365 60.3139C60.2912 60.5172 60.0981 60.6525 59.8818 60.6525V60.1385ZM54.1798 51.4004L53.6782 51.2879C53.7356 51.0323 53.976 50.8607 54.2364 50.8895C54.4968 50.9184 54.6938 51.1384 54.6938 51.4004H54.1798ZM53.1618 56.5638L53.6308 56.3534L53.1618 56.5638ZM49.5468 56.5638L49.1057 56.8277V56.8277L49.5468 56.5638ZM44.9139 59.3442L44.8507 59.8543V59.8543L44.9139 59.3442ZM39.2119 52.9891L38.7035 52.9131C38.7433 52.647 38.9816 52.4566 39.25 52.4766C39.5183 52.4965 39.7259 52.7201 39.7259 52.9891H39.2119ZM33.1534 60.1385V60.6525C32.8864 60.6525 32.6639 60.4481 32.6413 60.1821C32.6186 59.9161 32.8034 59.677 33.0665 59.6319L33.1534 60.1385ZM59.8818 60.1385L59.5522 60.5329C54.9167 56.6582 53.6658 52.925 53.6658 51.4004H54.1798H54.6938C54.6938 52.5237 55.7237 55.9929 60.2115 59.7442L59.8818 60.1385ZM54.1798 51.4004L54.6813 51.5129C54.5807 51.9615 54.4016 52.402 54.2211 52.8151C54.0344 53.2425 53.85 53.633 53.6983 54.0418C53.4013 54.8422 53.2836 55.5795 53.6308 56.3534L53.1618 56.5638L52.6928 56.7742C52.1847 55.6417 52.3978 54.5916 52.7345 53.6842C52.8997 53.239 53.1079 52.7953 53.2791 52.4035C53.4565 51.9975 53.6007 51.6337 53.6782 51.2879L54.1798 51.4004ZM53.1618 56.5638L53.6308 56.3534C53.9265 57.0126 53.987 57.6691 53.5789 58.142C53.2016 58.5792 52.5905 58.6496 52.0843 58.6011C51.5471 58.5497 50.9577 58.3528 50.4346 58.0575C49.9132 57.7631 49.4167 57.3476 49.1057 56.8277L49.5468 56.5638L49.988 56.3C50.181 56.6226 50.522 56.9263 50.94 57.1623C51.3562 57.3973 51.8081 57.5419 52.1822 57.5778C52.5875 57.6166 52.7579 57.5199 52.8007 57.4703C52.8126 57.4565 52.9317 57.3066 52.6928 56.7742L53.1618 56.5638ZM49.5468 56.5638L49.1057 56.8277C49.0171 56.6795 48.9498 56.5693 48.8983 56.4895C48.8416 56.4015 48.8207 56.3768 48.823 56.3793C48.8256 56.3822 48.8356 56.3929 48.8524 56.4068C48.8672 56.4192 48.9019 56.4462 48.9545 56.4696C49.0074 56.4932 49.1043 56.5243 49.2265 56.5059C49.3587 56.486 49.4598 56.4175 49.5247 56.344C49.5823 56.2789 49.6077 56.2152 49.6182 56.1847C49.6297 56.1512 49.6341 56.1254 49.6356 56.1148C49.6386 56.0946 49.6377 56.0871 49.6377 56.1046C49.6377 56.2225 49.7063 56.8427 49.6087 57.441C49.5048 58.0775 49.2074 58.826 48.4258 59.3394C47.6592 59.8428 46.5159 60.0605 44.8507 59.8543L44.9139 59.3442L44.9771 58.834C46.5194 59.025 47.3806 58.7959 47.8614 58.4801C48.3271 58.1743 48.5197 57.7312 48.5941 57.2755C48.6747 56.7814 48.6096 56.4087 48.6096 56.1046C48.6096 56.0693 48.6107 56.018 48.6188 55.9638C48.623 55.9352 48.6421 55.7903 48.7546 55.6631C48.8255 55.5829 48.9334 55.5104 49.0736 55.4893C49.2037 55.4697 49.3096 55.5024 49.3727 55.5305C49.484 55.5801 49.5556 55.6572 49.5802 55.684C49.6438 55.7532 49.7064 55.8457 49.7624 55.9326C49.8237 56.0277 49.8984 56.1503 49.988 56.3L49.5468 56.5638ZM44.9139 59.3442L44.8507 59.8543C42.4518 59.5572 40.8639 58.6826 39.888 57.5177C38.9159 56.3574 38.6018 54.9694 38.632 53.7365L39.1458 53.7491L39.6597 53.7617C39.634 54.8084 39.9013 55.9328 40.676 56.8575C41.4469 57.7777 42.7709 58.5608 44.9771 58.834L44.9139 59.3442ZM39.1458 53.7491L38.632 53.7365C38.6389 53.4538 38.6639 53.178 38.7035 52.9131L39.2119 52.9891L39.7202 53.0652C39.6867 53.2895 39.6655 53.523 39.6597 53.7617L39.1458 53.7491ZM39.2119 52.9891H39.7259C39.7259 53.2604 39.7007 53.5434 39.653 53.8327L39.1458 53.7491L38.6387 53.6656C38.6784 53.4242 38.6978 53.1975 38.6978 52.9891H39.2119ZM39.1458 53.7491L39.653 53.8327C39.4339 55.1623 38.728 56.7004 37.6449 57.9824C36.5592 59.2674 35.0618 60.3328 33.2403 60.6451L33.1534 60.1385L33.0665 59.6319C34.5903 59.3706 35.8866 58.4706 36.8596 57.319C37.835 56.1644 38.4527 54.7946 38.6387 53.6656L39.1458 53.7491ZM33.1534 60.1385V59.6245H59.8818V60.1385V60.6525H33.1534V60.1385Z" fill="#8585D6"/>
      <path d="M60.6368 15.6921C56.1984 11.2642 50.2598 8.6634 43.9958 8.40422C37.7318 8.14505 31.5986 10.2464 26.8097 14.2925C22.0207 18.3386 18.9248 24.0348 18.1343 30.2541C17.3439 36.4735 18.9166 42.763 22.5412 47.8784C26.1658 52.9938 31.5784 56.5625 37.7081 57.8785C43.8378 59.1944 50.2382 58.1618 55.643 54.9849C61.0479 51.808 65.0635 46.7182 66.8955 40.7224C68.7275 34.7267 68.2424 28.2617 65.5361 22.6065" fill="white"/>
      <path d="M60.6368 15.6921C56.1984 11.2642 50.2598 8.6634 43.9958 8.40422C37.7318 8.14505 31.5986 10.2464 26.8097 14.2925C22.0207 18.3386 18.9248 24.0348 18.1343 30.2541C17.3439 36.4735 18.9166 42.763 22.5412 47.8784C26.1658 52.9938 31.5784 56.5625 37.7081 57.8785C43.8378 59.1944 50.2382 58.1618 55.643 54.9849C61.0479 51.808 65.0635 46.7182 66.8955 40.7224C68.7275 34.7267 68.2424 28.2617 65.5361 22.6065" stroke="#6666CC" strokeWidth="4.17632" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M51.7774 24.552C49.7048 22.4819 46.9725 21.2035 44.0551 20.9389C41.1378 20.6743 38.22 21.4403 35.8089 23.1037C33.3977 24.7671 31.6456 27.2228 30.857 30.0439C30.0685 32.8651 30.2934 35.8734 31.4926 38.5459C32.6918 41.2185 34.7896 43.3863 37.4213 44.6728C40.0529 45.9592 43.0522 46.2829 45.8977 45.5875C48.7433 44.8921 51.2552 43.2216 52.997 40.8664C54.7387 38.5113 55.6002 35.6202 55.4317 32.6958" stroke="#6666CC" strokeWidth="4.17632" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M67.086 9.79785L44.1162 33.8117" stroke="#5252A3" strokeWidth="4.17632" strokeLinecap="round"/>
      <path d="M70.7975 1.44629L64.9971 7.24673V11.8871H69.6374L75.4379 6.08664L70.7975 6.10606V1.44629Z" fill="#5252A3" stroke="#6666CC" strokeWidth="1.04408" strokeLinecap="square" strokeLinejoin="round"/>
      <path d="M7.08192 46.8937C7.19969 46.973 7.23095 47.1326 7.15173 47.2504C7.07251 47.3682 6.91281 47.3995 6.79504 47.3202L6.93848 47.107L7.08192 46.8937ZM5.38905 45.1963L5.14148 45.1273C5.17598 45.0035 5.29658 44.9242 5.42387 44.9417C5.55117 44.9591 5.64605 45.0678 5.64605 45.1963H5.38905ZM5.38905 46.7596L5.16457 46.8847L5.38905 46.7596ZM2.87122 46.9333L2.84574 47.189L2.87122 46.9333ZM1.41863 45.1963L1.16595 45.1493C1.19021 45.0188 1.30996 44.9282 1.44221 44.9404C1.57445 44.9526 1.67563 45.0635 1.67563 45.1963H1.41863ZM0.291681 47.1879C0.151074 47.2073 0.0213623 47.109 0.00196171 46.9684C-0.0174384 46.8278 0.0808191 46.6981 0.221426 46.6787L0.256554 46.9333L0.291681 47.1879ZM6.93848 47.107L6.79504 47.3202C6.15266 46.8882 5.74066 46.461 5.48731 46.0934C5.23899 45.733 5.13204 45.4129 5.13204 45.1963H5.38905H5.64605C5.64605 45.2692 5.69404 45.4875 5.91055 45.8017C6.12203 46.1086 6.48475 46.4921 7.08192 46.8937L6.93848 47.107ZM5.38905 45.1963L5.63661 45.2653C5.59237 45.424 5.5379 45.6923 5.52216 45.9666C5.50579 46.2518 5.5347 46.4931 5.61352 46.6344L5.38905 46.7596L5.16457 46.8847C5.01098 46.6092 4.99147 46.2425 5.00899 45.9372C5.02714 45.6209 5.08888 45.316 5.14148 45.1273L5.38905 45.1963ZM5.38905 46.7596L5.61352 46.6344C5.66001 46.7178 5.71364 46.8499 5.66624 46.9905C5.61181 47.1519 5.46871 47.2084 5.37904 47.2252C5.28782 47.2424 5.19112 47.2338 5.10768 47.2185C5.02026 47.2024 4.92797 47.1752 4.83788 47.141C4.66025 47.0736 4.46866 46.9704 4.32241 46.8443C4.19476 46.7342 4.01496 46.5295 4.07297 46.2694L4.32381 46.3253L4.57465 46.3813C4.58424 46.3383 4.5497 46.3616 4.65809 46.455C4.74789 46.5325 4.88314 46.6084 5.02023 46.6604C5.08751 46.686 5.14956 46.7035 5.20059 46.7129C5.22594 46.7176 5.24643 46.7198 5.26198 46.7205C5.2781 46.7211 5.28477 46.7199 5.28405 46.7201C5.28336 46.7202 5.27932 46.721 5.27288 46.7234C5.26641 46.7259 5.25642 46.7304 5.24479 46.7384C5.21901 46.7561 5.19279 46.7859 5.17918 46.8262C5.15524 46.8972 5.19071 46.9316 5.16457 46.8847L5.38905 46.7596ZM4.32381 46.3253L4.07297 46.2694C4.08109 46.233 4.09157 46.1964 4.10575 46.1628C4.11563 46.1393 4.14282 46.0776 4.20323 46.0308C4.23778 46.004 4.30377 45.9669 4.39236 45.9751C4.48402 45.9837 4.54475 46.0354 4.5764 46.0753C4.62899 46.1416 4.63664 46.2147 4.63878 46.2384C4.65008 46.3633 4.60226 46.528 4.49901 46.6776C4.27132 47.0075 3.77579 47.2817 2.84574 47.189L2.87122 46.9333L2.8967 46.6775C3.70976 46.7586 3.98894 46.5117 4.07599 46.3856C4.13009 46.3072 4.12465 46.2602 4.12686 46.2847C4.12738 46.2904 4.12882 46.3023 4.13344 46.318C4.13741 46.3315 4.14782 46.3621 4.17378 46.3948C4.20158 46.4299 4.2579 46.4789 4.34472 46.4869C4.42847 46.4947 4.48918 46.4595 4.51816 46.437C4.54685 46.4148 4.56242 46.3921 4.56831 46.3829C4.57529 46.372 4.57865 46.3642 4.57947 46.3622C4.58102 46.3586 4.57864 46.3634 4.57465 46.3813L4.32381 46.3253ZM2.87122 46.9333L2.84574 47.189C2.07516 47.1122 1.6092 46.7674 1.36252 46.3356C1.12461 45.9191 1.1092 45.4547 1.16595 45.1493L1.41863 45.1963L1.67131 45.2432C1.63121 45.459 1.64486 45.7936 1.80883 46.0806C1.96403 46.3523 2.27279 46.6154 2.8967 46.6775L2.87122 46.9333ZM1.41863 45.1963H1.67563C1.67563 45.4834 1.63528 45.9258 1.44778 46.324C1.25482 46.7338 0.899779 47.104 0.291681 47.1879L0.256554 46.9333L0.221426 46.6787C0.620459 46.6236 0.846456 46.3945 0.982751 46.105C1.1245 45.804 1.16162 45.4475 1.16162 45.1963H1.41863Z" fill="#A3A3E0"/>
    </svg>
  )
}

/* ── Load goals from localStorage ── */
function loadGoals() {
  try { return JSON.parse(localStorage.getItem('trumi_goals') ?? '[]') } catch { return [] }
}

/* ── Helpers used for insight generation ── */
function computeGoalStreak(loggedDays = []) {
  const logged = new Set(loggedDays)
  let streak = 0
  for (let i = 0; i < 365; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    if (logged.has(d.toISOString().split('T')[0])) streak++
    else if (i > 0) break
  }
  return streak
}

function getThisWeekCount(loggedDays = []) {
  const today   = new Date()
  const dow     = today.getDay()
  const monday  = new Date(today)
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1))
  monday.setHours(0, 0, 0, 0)
  return loggedDays.filter(d => new Date(d) >= monday).length
}

function getDaysIntoGoal(startDateStr) {
  try {
    const start = new Date(startDateStr)
    if (isNaN(start)) return 0
    return Math.max(0, Math.floor((Date.now() - start.getTime()) / 86400000))
  } catch { return 0 }
}



const TERMS = [
  { key: 'short', label: 'Short Term' },
  { key: 'long',  label: 'Long Term' },
  { key: 'all',   label: 'All' },
]

export default function Goals() {
  const navigate = useNavigate()
  const [termFilter,   setTermFilter]   = useState('short')
  const [statusFilter, setStatusFilter] = useState('active')
  const [goals, setGoals] = useState(loadGoals)

  // Fetch AI-generated meta for goals that don't have it yet
  useEffect(() => {
    const goalsNeedingMeta = goals.filter(g => g.unit == null)
    if (goalsNeedingMeta.length === 0) return

    goalsNeedingMeta.forEach(goal => {
      getGoalMeta({
        title:          goal.title,
        successType:    goal.successType,
        executionStyle: goal.executionStyle,
        weeklyTimes:    goal.weeklyTimes,
      }).then(meta => {
        setGoals(prev => {
          const updated = prev.map(g =>
            g.id === goal.id
              ? { ...g, actionLabel: meta.actionLabel, unit: meta.unit }
              : g
          )
          localStorage.setItem('trumi_goals', JSON.stringify(updated))
          return updated
        })
      }).catch(() => {})
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch AI insights — generated once per goal, then refreshed whenever loggedDays.length changes
  useEffect(() => {
    goals.forEach(goal => {
      if (goal.status === 'paused') return
      const currentCount = (goal.loggedDays ?? []).length
      // Skip if insight is fresh (same logged count as when it was last generated)
      if (goal.insight && goal.insightLoggedCount === currentCount) return

      // Only generate an insight if there is actual progress data
      if (currentCount === 0) return

      const streak        = computeGoalStreak(goal.loggedDays ?? [])
      const thisWeekCount = getThisWeekCount(goal.loggedDays ?? [])
      const daysIntoGoal  = getDaysIntoGoal(goal.startDate)

      getGoalInsight({
        title:         goal.title,
        unit:          goal.unit ?? 'Sessions',
        totalLogged:   currentCount,
        streak,
        thisWeekCount,
        daysIntoGoal,
      }).then(insight => {
        setGoals(prev => {
          const updated = prev.map(g =>
            g.id === goal.id
              ? { ...g, insight, insightLoggedCount: currentCount }
              : g
          )
          localStorage.setItem('trumi_goals', JSON.stringify(updated))
          return updated
        })
      }).catch(() => {})
    })
  }, [goals.map(g => (g.loggedDays ?? []).length).join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  // Quick-complete: mark today as 100% done, auto-add to loggedDays
  function handleQuickComplete(goalId) {
    setGoals(prev => {
      const todayStr = new Date().toISOString().split('T')[0]
      const updated  = prev.map(g => {
        if (g.id !== goalId) return g
        const dailyLogs  = { ...(g.dailyLogs ?? {}), [todayStr]: 100 }
        const loggedDays = g.loggedDays ?? []
        const newLoggedDays = loggedDays.includes(todayStr)
          ? loggedDays
          : [...loggedDays, todayStr]
        return { ...g, dailyLogs, loggedDays: newLoggedDays }
      })
      localStorage.setItem('trumi_goals', JSON.stringify(updated))
      return updated
    })
  }

  // Create Entry: navigate to dedicated log screen (design coming later)
  function handleCreateEntry(goalId) {
    navigate(`/log-entry/${goalId}`)
  }

  // Pause / resume toggle
  function handlePause(goalId) {
    setGoals(prev => {
      const updated = prev.map(g => {
        if (g.id !== goalId) return g
        return { ...g, status: g.status === 'paused' ? 'active' : 'paused' }
      })
      localStorage.setItem('trumi_goals', JSON.stringify(updated))
      return updated
    })
  }

  // Delete goal permanently
  function handleDelete(goalId) {
    setGoals(prev => {
      const updated = prev.filter(g => g.id !== goalId)
      localStorage.setItem('trumi_goals', JSON.stringify(updated))
      return updated
    })
  }

  const activeCount = goals.filter(g => g.status === 'active').length
  const pausedCount = goals.filter(g => g.status === 'paused').length

  const filtered = goals.filter(g => {
    const termOk   = termFilter === 'all' || g.term === termFilter
    const statusOk = g.status === statusFilter
    return termOk && statusOk
  })

  return (
    <div className="goals-page">



      {/* ── Bullseye icon ───────────────────────── */}
      <div className="goals-bullseye" aria-hidden="true">
        <BullseyeIcon />
      </div>

      {/* ── Short Term / Long Term / All nav ────── */}
      <nav className="goals-term-nav" aria-label="Filter goals by term">
        {TERMS.map(({ key, label }, i) => (
          <span key={key} className="goals-term-nav__item">
            {i > 0 && <span className="goals-term-nav__sep" aria-hidden="true">|</span>}
            <button
              className={`goals-term-nav__btn${termFilter === key ? ' goals-term-nav__btn--active' : ''}`}
              onClick={() => setTermFilter(key)}
            >
              {label}
            </button>
          </span>
        ))}
      </nav>

      {/* ── Status tabs + scrollable cards area ── */}
      <div className="goals-content">

        {/* Tab row — aligned to bottom, sitting just above the border */}
        <div className="goals-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={statusFilter === 'active'}
            className={`goals-tab${statusFilter === 'active' ? ' goals-tab--selected' : ' goals-tab--dim'}`}
            onClick={() => setStatusFilter('active')}
          >
            <u>{activeCount}</u> Active Goals
          </button>
          <button
            role="tab"
            aria-selected={statusFilter === 'paused'}
            className={`goals-tab${statusFilter === 'paused' ? ' goals-tab--selected' : ' goals-tab--dim'}`}
            onClick={() => setStatusFilter('paused')}
          >
            <u>{pausedCount}</u> Paused Goals
          </button>
          <button
            className="goals-tab__add-btn"
            onClick={() => navigate('/add-goal')}
            aria-label="Add a new goal"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1.5V12.5M1.5 7H12.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Bordered card area */}
        <div className="goals-cards-area">
          {filtered.length === 0 ? (
            <p className="goals-empty">
              No {statusFilter} goals yet. Tap + to add one whenever you're ready.
            </p>
          ) : (
            <ul className="goals-cards-list">
              {filtered.map(goal => (
                <li key={goal.id}>
                  <GoalCard
                    id={goal.id}
                    title={goal.title}
                    startDate={goal.startDate}
                    status={goal.status}
                    loggedDays={goal.loggedDays ?? []}
                    dailyLogs={goal.dailyLogs ?? {}}
                    unit={goal.unit}
                    actionLabel={goal.actionLabel ?? null}
                    insight={goal.insight ?? null}
                    onQuickComplete={handleQuickComplete}
                    onCreateEntry={handleCreateEntry}
                    onPause={handlePause}
                    onDelete={handleDelete}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

    </div>
  )
}
