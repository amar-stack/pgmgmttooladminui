/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  mdiAccountCircle,
  mdiMonitor,
  mdiGithub,
  mdiLock,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiViewList,
  mdiTelevisionGuide,
  mdiResponsive,
  mdiPalette,
  mdiVuejs,
} from '@mdi/js'
import { MenuAsideItem } from './interfaces'

const menuAside: MenuAsideItem[] = [
  {
    href: '/userdatatable',
    icon: mdiMonitor,
    label: 'Dashboard',
  },
  {
    href: '/ServiceRequests',
    label: 'Service Requests',
    icon: mdiTable,
  },
  
]

export default menuAside
