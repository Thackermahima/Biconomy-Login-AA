"use client"; // this is a client component 👈🏽
import { useState, useEffect, useRef } from "react";
import SocialLogin from "@biconomy/web3-auth";
import { ChainId } from "@biconomy/core-types";
import SmartAccount from "@biconomy/smart-account";
import { ethers } from "ethers";
import {css} from "@emotion/css";
import "@biconomy/web3-auth/dist/src/style.css";


export default function Auth(){
    const[smartAccount, setSmartAccount] = useState<SmartAccount | null>(null);
    const [interval, enableInterval] = useState<boolean>(false);
    const sdkRef = useRef<SocialLogin | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        let configureLogin: any
        if(interval){
            configureLogin = setInterval(() => {
                if(!!sdkRef.current?.provider){
                    setupSmartAccount();
                    clearInterval(configureLogin);
                }
            }, 1000);
        }
    },[interval])
    async function login(){
    
        if(!sdkRef.current){
            const socialLoginSDK = new SocialLogin();
            await socialLoginSDK.init({ chainId: ethers.utils.hexValue(ChainId.POLYGON_MUMBAI)})
            sdkRef.current = socialLoginSDK
        }
        if(!sdkRef.current.provider){
            sdkRef.current.showWallet();
            enableInterval(true);
        } else {
            setupSmartAccount()
        }
    }
    async function logout(){
        if(!sdkRef.current){
            console.error('WebModal not initialized.')
            return
        }
        await sdkRef.current.logout()
        sdkRef.current.hideWallet()
        setSmartAccount(null);
        enableInterval(false)
    }
    async function setupSmartAccount(){
     if(!sdkRef?.current?.provider) return
     setLoading(true);
     sdkRef.current.hideWallet()
     const web3Provider = new ethers.providers.Web3Provider(
        sdkRef.current.provider
     )
     try {
        const smartAccount = new SmartAccount( web3Provider, {
            activeNetworkId: ChainId.POLYGON_MUMBAI,
            supportedNetworksIds : [ChainId.POLYGON_MUMBAI],
        });
        await smartAccount.init();
        setSmartAccount(smartAccount);
        setLoading(false);
     } catch (error) {
        console.log(error,"Error from setupSmartAccount");
        
     }
    }
    return (
        <div className={containerStyle}>
    <h1 className={headerStyle}>Biconomy Auth Example</h1>
{ 
!smartAccount && !loading && <button className={buttonStyle} onClick={login}>Login</button>
}
{
    loading && <p>Loading account details...</p>
}
{
    !!smartAccount && (
        <div className={detailsContainerStyle}>
            <h3>Smart account address: </h3>
            <p>{smartAccount.address}</p>
            <button className={buttonStyle} onClick={logout}>Logout</button>
        </div>
    )
}
        </div>
    )
}

const detailsContainerStyle = css`
  margin-top: 10px;
`

const buttonStyle = css`
  padding: 14px;
  width: 300px;
  border: none;
  cursor: pointer;
  border-radius: 999px;
  outline: none;
  margin-top: 20px;
  transition: all .25s;
  &:hover {
    background-color: rgba(0, 0, 0, .2); 
  }
`

const headerStyle = css`
  font-size: 44px;
`

const containerStyle = css`
  width: 900px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 100px;
  `