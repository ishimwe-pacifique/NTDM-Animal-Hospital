declare module 'lucide-react' {
  import { FC, SVGProps } from 'react'
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number
    color?: string
    strokeWidth?: string | number
  }
  export const Calendar: FC<IconProps>
  export const Users: FC<IconProps>
  export const Stethoscope: FC<IconProps>
  export const Clock: FC<IconProps>
  export const MessageSquare: FC<IconProps>
  export const ClipboardList: FC<IconProps>
  export const Bell: FC<IconProps>
  export const User: FC<IconProps>
  export const Home: FC<IconProps>
  export const Settings: FC<IconProps>
} 