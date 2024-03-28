/* eslint-disable @typescript-eslint/no-unused-vars */
import { mdiTableBorder } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect } from 'react'
import CardBox from '../components/CardBox'
import LayoutAuthenticated from '../layouts/Authenticated'
import SectionMain from '../components/Section/Main'
import SectionTitleLineWithButton from '../components/Section/TitleLineWithButton'
import TableSampleClients from '../components/Table/SampleClients'
import { getPageTitle } from '../config'
import { useAppDispatch, useAppSelector } from '../stores/hooks'
import { useRouter } from 'next/router'

const TablesPage = () => {
  
  const dispatch = useAppDispatch()
  const router = useRouter()

  const {isAuthenticated} = useAppSelector((state) => state.auth)

  useEffect(()=> {
    console.log(isAuthenticated, "isAuthenticated")
    if(!isAuthenticated){
      router.push('/login')
    }
    else{
      router.push('/userdatatable')
    }
  }, [isAuthenticated, router])
  return (
    
    isAuthenticated && (
      <>
    </>
    ))
}

export default TablesPage
