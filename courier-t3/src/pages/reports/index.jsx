import Layout from '@/components/Layout'
import React from 'react'

const ReportsHomePage = () => {
  return <div>ReportsHomePage</div>
}

export default ReportsHomePage

ReportsHomePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
