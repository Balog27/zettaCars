"use client"

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLocale } from 'next-intl'

const languages = {
  ro: { name: 'Română', flag: '🇷🇴' },
  en: { name: 'English', flag: '🇺🇸' }
}

export function LanguageSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  const handleLanguageChange = (newLocale: string) => {
    // Remove current locale from pathname if it exists
    const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/'
    
    // Both Romanian and English will have explicit prefixes
    const newPath = `/${newLocale}${pathnameWithoutLocale}`
    
    router.push(newPath)
  }
  
  return (
    <Select value={locale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[70px]">
          <SelectValue>
            {mounted ? languages[locale as keyof typeof languages]?.flag : null}
          </SelectValue>
        </SelectTrigger>
      <SelectContent>
        <SelectItem value="ro">
          <div className="flex items-center gap-2">
            <span>{languages.ro.flag}</span>
            <span>{languages.ro.name}</span>
          </div>
        </SelectItem>
        <SelectItem value="en">
          <div className="flex items-center gap-2">
            <span>{languages.en.flag}</span>
            <span>{languages.en.name}</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
} 