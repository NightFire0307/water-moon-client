import { flowRight } from 'lodash-es'
import withAuthGuard from './withAuthGurard'

export const EnhancedComponent = flowRight(withAuthGuard)
