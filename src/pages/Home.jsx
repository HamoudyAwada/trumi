import PageHeader from '../components/ui/PageHeader'
import './Home.css'

export default function Home() {
  return (
    <div className="home-page">
      <PageHeader title="Home" />
      <main className="home-content" />
    </div>
  )
}
