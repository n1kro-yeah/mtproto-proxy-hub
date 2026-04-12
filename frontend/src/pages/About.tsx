import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GitHubIcon from '@mui/icons-material/GitHub';
import PersonIcon from '@mui/icons-material/Person';
import '../styles/About.css';

export function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <div className="about-container">
        <button onClick={() => navigate('/')} className="back-button">
          <ArrowBackIcon />
          <span>Назад</span>
        </button>

        <div className="about-content">
          <h1>О проекте MTProto Proxy Hub</h1>
          
          <section className="about-section">
            <h2>Описание</h2>
            <p>
              MTProto Proxy Hub - это веб-приложение для мониторинга и управления Telegram прокси-серверами. 
              Проект предоставляет удобный интерфейс для проверки доступности прокси, измерения скорости 
              соединения и получения информации о геолокации серверов.
            </p>
          </section>

          <section className="about-section">
            <h2>Основные возможности</h2>
            <ul>
              <li>Проверка статуса MTProto и SOCKS5 прокси-серверов</li>
              <li>Измерение задержки соединения (TCP, ICMP, через прокси)</li>
              <li>Определение геолокации прокси-серверов</li>
              <li>Сортировка прокси по различным критериям</li>
              <li>Автоматическая загрузка прокси из GitHub</li>
              <li>Темная тема интерфейса</li>
              <li>Адаптивный дизайн для мобильных устройств</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Технологии</h2>
            <ul>
              <li>Frontend: React + TypeScript + Vite</li>
              <li>Backend: FastAPI + Python</li>
              <li>UI: Material UI + Custom Soft UI Design</li>
              <li>Анимации: Framer Motion</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Ссылки</h2>
            <div className="links-container">
              <a 
                href="https://github.com/n1kro-yeah" 
                target="_blank" 
                rel="noopener noreferrer"
                className="link-card"
              >
                <PersonIcon />
                <div className="link-content">
                  <h3>Автор проекта</h3>
                  <p>github.com/n1kro-yeah</p>
                </div>
              </a>

              <a 
                href="https://github.com/n1kro-yeah/mtproto-proxy-hub" 
                target="_blank" 
                rel="noopener noreferrer"
                className="link-card"
              >
                <GitHubIcon />
                <div className="link-content">
                  <h3>Репозиторий проекта</h3>
                  <p>github.com/n1kro-yeah/mtproto-proxy-hub</p>
                </div>
              </a>
            </div>
          </section>

          <section className="about-section">
            <h2>Лицензия</h2>
            <p>
              Проект распространяется под лицензией MIT. Вы можете свободно использовать, 
              изменять и распространять код с указанием авторства.
            </p>
          </section>

          <section className="about-section version-section">
            <p className="version">Версия 1.0.0</p>
          </section>
        </div>
      </div>
    </div>
  );
}
