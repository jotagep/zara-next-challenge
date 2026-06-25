import { Button } from '@/shared/components/Button/Button'
import { ROUTES } from '@/shared/config/routes'

export default function PhoneNotFound() {
  return (
    <div className="messageScreenCenter">
      <div className="messageScreenCard">
        <h1 className="messageScreenTitle">Phone not found</h1>
        <p className="messageScreenMessage">
          The phone you&apos;re looking for is no longer available.
        </p>
        <Button href={ROUTES.home}>Continue shopping</Button>
      </div>
    </div>
  )
}
