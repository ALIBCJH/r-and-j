'use client'

import { WizardProvider } from '@/app/components/style-picker/wizard/WizardProvider'
import { WizardShell }    from '@/app/components/style-picker/wizard/WizardShell'

export default function StylePickerClient() {
  return (
    <WizardProvider>
      <WizardShell />
    </WizardProvider>
  )
}
