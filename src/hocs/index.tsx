import { flowRight } from 'lodash-es'
import withAuthGuard from './withAuthGurard'
import withOrderStatusGuard from './withOrderStatusGuard'

export const EnhancedComponent = flowRight(withOrderStatusGuard, withAuthGuard)
