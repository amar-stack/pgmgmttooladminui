/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react'
import type { ReactElement } from 'react'
import Head from 'next/head'
import Button from '../components/Button'
import CardBox from '../components/CardBox'
import SectionFullScreen from '../components/Section/FullScreen'
import LayoutGuest from '../layouts/Guest'
import { Field, Form, Formik } from 'formik'
import FormField from '../components/Form/Field'
import FormCheckRadio from '../components/Form/CheckRadio'
import Divider from '../components/Divider'
import Buttons from '../components/Buttons'
import { useRouter } from 'next/router'
import { getPageTitle } from '../config'
import axios from 'axios'
import { useAppDispatch, useAppSelector } from '../stores/hooks'
import { setUser } from '../stores/mainSlice'
import { login } from '../stores/authSlice'

type LoginForm = {
  email: string
  password: string
  remember: boolean
}

const LoginPage = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const {isAuthenticated} = useAppSelector((state) => state.auth)

  const handleSubmit = (formValues: LoginForm) => {
    // axios.post("http://13.234.239.70:3000/v1/auth/login", {
    //   email: formValues.email,
    //   password: formValues.password
    //   // add more data if needed
    // })
    // .then(response => {
    //     // If request is good...
    //     // return {
    //       // console.log(response?.data?.results)
    //       // setClients(response?.data?.results)
    //     // }
    //     dispatch(setUser({...response.data.user, accesstoken: response.data.tokens.access.token}))
    //     router.push('/userdatatable')
    //   })

    dispatch(login({email: formValues.email, password: formValues.password}))
    // router.push('/userdatatable')
    
  }

  const initialValues: LoginForm = {
    email: '',
    password: '',
    remember: true,
  }

  useEffect(()=> {
    if(isAuthenticated){
      router.push('/userdatatable')
    }
  }, [isAuthenticated, router])

  return (
    <>
      <Head>
        <title>{getPageTitle('Login')}</title>
      </Head>

      <SectionFullScreen bg="purplePink">
        <CardBox className="w-11/12 md:w-7/12 lg:w-6/12 xl:w-4/12 shadow-2xl">
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            <Form>
              <FormField label="Username" help="Please enter your Username">
                <Field name="email" />
              </FormField>

              <FormField label="Password" help="Please enter your password">
                <Field name="password" type="password" />
              </FormField>

              <FormCheckRadio type="checkbox" label="Remember">
                <Field type="checkbox" name="remember" />
              </FormCheckRadio>

              <Divider />

              <Buttons>
                <Button type="submit" label="Login" color="info" />
                <Button href="/dashboard" label="Home" color="info" outline />
              </Buttons>
            </Form>
          </Formik>
        </CardBox>
      </SectionFullScreen>
    </>
  )
}

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>
}

export default LoginPage
