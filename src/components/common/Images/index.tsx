import React from 'react'
import Image from 'next/image'
import Logo from "../../assets/logo.svg"
import AbiaStatelogo from "../../assets/abia_logo.jpeg"
import LogoWhite from "../../assets/logo_white.svg"
import EnumerartionLogo from "../../../../public/abia-logo.jpg"

export const AbiaLogo = () => {
  return (
    <div>
      <Image src={Logo} alt="Abiapay Agents Logo" width={100} loading='eager' priority={true}/>
    </div>
  )
}

export const AbiaStateLogo = () => {
  return (
    <div>
      <Image src={AbiaStatelogo} alt="Abiapay State Logo" width={70} loading='eager' priority={true}/>
    </div>
  )
}
export const AbiaLogoWhite = () => {
  return (
    <div>
      <Image src={LogoWhite} alt="Abiapay Agents Logo" width={100} loading='eager' priority={true}/>
    </div>
  )
}

export const AbiaLogoLarge = () => {
  return (
    <div>
      <Image src={Logo} alt="Abiapay Agents Logo" width={150} loading='eager' priority={true}/>
    </div>
  )
}

export const AbiaEnumerationLarge = () => {
  return (
    <div>
      <Image src={EnumerartionLogo} alt="Abiapay Agents Logo" width={75} loading='eager' priority={true}/>
    </div>
  )
}
