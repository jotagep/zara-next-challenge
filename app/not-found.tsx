import { Button } from '@/shared/components/Button/Button'
import { ROUTES } from '@/shared/config/routes'

export default function NotFound() {
  return (
    <div className="messageScreenCenter">
      <div className="messageScreenCard">
        <h1 className="messageScreenTitle">Page not found</h1>
        <p className="messageScreenMessage">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Button href={ROUTES.home}>Continue shopping</Button>
      </div>
    </div>
  )
}
