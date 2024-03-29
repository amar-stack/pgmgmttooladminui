/* eslint-disable @typescript-eslint/no-unused-vars */
import { mdiEye, mdiTrashCan } from '@mdi/js'
import React, { useEffect, useState } from 'react'
import { useSampleClients } from '../../hooks/sampleData'
import { Client } from '../../interfaces'
import Button from '../Button'
import Buttons from '../Buttons'
import CardBoxModal from '../CardBox/Modal'
import UserAvatar from '../UserAvatar'
import axios from '../../api/baseAPI'
import { useAppSelector } from '../../stores/hooks'
import PillTag from '../PillTag'
import Image from 'next/image'

const TableSampleClients = () => {
  // const { clients } = useSampleClients()
  const accesstoken = useAppSelector((state) => state.auth.accessToken)
  console.log(accesstoken, 'ace')
  const [clients, setClients] = useState([])
  useEffect(() => {
    // const AuthStr = `Bearer ${accesstoken}`;
    axios.get('http://3.111.218.67:3000/v1/users').then((response) => {
      // If request is good...
      // return {
      console.log(response?.data?.results)
      const checkExists = response?.data?.results
      const userdata = checkExists.filter((user) => user.role !== 'admin')
      setClients(userdata)
      // }
    })
  }, [accesstoken])

  const perPage = 10

  const [currentPage, setCurrentPage] = useState(0)

  const clientsPaginated = clients.slice(perPage * currentPage, perPage * (currentPage + 1))

  const numPages = clients.length / perPage

  const pagesList = []

  for (let i = 0; i < numPages; i++) {
    pagesList.push(i)
  }

  const [isModalInfoActive, setIsModalInfoActive] = useState(false)
  const [clientId, setClientId] = useState({})
  const [isModalTrashActive, setIsModalTrashActive] = useState(false)
  const [link, setLink] = useState('')

  const handleModalAction = () => {
    setIsModalInfoActive(false)
    setIsModalTrashActive(false)
  }

  const generateLinks = (clientId) => {
    const link = `http://3.111.218.67:5000/dashboard/uploadDocs/${clientId.id}`
    setLink(link)
  }

  return (
    <>
      <CardBoxModal
        title="Sample modal"
        buttonColor="info"
        buttonLabel="Done"
        isActive={isModalInfoActive}
        onConfirm={handleModalAction}
        onCancel={handleModalAction}
      >
        <div className={`max-h-[calc(100vh-300px)] overflow-y-auto`}>
          {Object.keys(clientId).map((key, index) => (
            <>
              <div key={index}>
                {key === 'institutionIDurl' || key === 'uploadAdharurl' ? (
                  clientId[key] !== '' && (
                    <p>
                      {key}:{' '}
                      <span>
                        <a href={clientId[key]} target="_blank">
                          <Image src={clientId[key]} width={200} height={200} alt="image" />
                        </a>
                      </span>
                    </p>
                  )
                ) : (
                  <p>
                    {key}: {clientId[key]}
                  </p>
                )}
              </div>
            </>
          ))}

          {/* {Object.entries(client).map(([val, key] = clients ) => (
                <p key={client.id}>{val} : {key}</p>
              ))}  */}
        </div>
        {!(clientId['institutionIDurl'] || clientId['uploadAdharurl']) && (
          <>
            <Button
              label="generatedocslink"
              color="contrast"
              onClick={() => generateLinks(clientId)}
            />
            {link && <h4 color="info">{link}</h4>}
          </>
        )}
      </CardBoxModal>

      <CardBoxModal
        title="Please confirm"
        buttonColor="danger"
        buttonLabel="Confirm"
        isActive={isModalTrashActive}
        onConfirm={handleModalAction}
        onCancel={handleModalAction}
      >
        {clientsPaginated.map((client: Client, key) => (
          <div key={client.id}>
            <p>{key}</p>
            <p>{client.name}</p>
          </div>
        ))}
      </CardBoxModal>

      <table>
        <thead>
          <tr>
            <th />
            <th>Name</th>
            <th>Email</th>
            <th>Designation</th>
            <th>Requirement</th>
            <th>Budget</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {clientsPaginated.map((client: Client) => (
            <tr key={client.id}>
              <td className="border-b-0 lg:w-6 before:hidden">
                <UserAvatar username={client.name} className="w-24 h-24 mx-auto lg:w-6 lg:h-6" />
              </td>
              <td data-label="Name">{client.name}</td>
              <td data-label="Email">{client.email}</td>
              <td data-label="Phone">{client.designation}</td>
              <td data-label="Requirement">{client.bed}</td>

              <td data-label="Budget" className="lg:w-1 whitespace-nowrap">
                <small className="text-gray-500 dark:text-slate-400">{client.budget}</small>
              </td>
              <td className="before:hidden lg:w-1 whitespace-nowrap">
                <Buttons type="justify-start lg:justify-end" noWrap>
                  <Button
                    color="info"
                    icon={mdiEye}
                    onClick={() => {
                      setIsModalInfoActive(true)
                      setClientId(client)
                    }}
                    small
                  />
                </Buttons>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 md:py-0">
          <Buttons>
            {pagesList.map((page) => (
              <Button
                key={page}
                active={page === currentPage}
                label={page + 1}
                color={page === currentPage ? 'lightDark' : 'whiteDark'}
                small
                onClick={() => setCurrentPage(page)}
              />
            ))}
          </Buttons>
          <small className="mt-6 md:mt-0">
            Page {currentPage + 1} of {numPages}
          </small>
        </div>
      </div>
    </>
  )
}

export default TableSampleClients
