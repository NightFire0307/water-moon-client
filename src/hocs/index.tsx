import { flowRight } from 'lodash-es'
import withAuthGuard from './withAuthGuard'
import withOrderStatusGuard from './withOrderStatusGuard'

export const EnhancedComponent = flowRight(withAuthGuard, withOrderStatusGuard)
