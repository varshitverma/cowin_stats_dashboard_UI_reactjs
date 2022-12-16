// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    cowinData: {},
  }

  componentDidMount() {
    this.getCowinData()
  }

  getCowinData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(apiUrl)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = {
        last7DaysVaccination: fetchedData.last_7_days_vaccination.map(data => ({
          vaccineDate: data.vaccine_date,
          dose1: data.dose_1,
          dose2: data.dose_2,
        })),
        vaccinationByAge: fetchedData.vaccination_by_age.map(data => ({
          age: data.age,
          count: data.count,
        })),
        vaccinationByGender: fetchedData.vaccination_by_gender.map(data => ({
          gender: data.gender,
          count: data.count,
        })),
      }
      this.setState({
        cowinData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  renderVaccinationStats = () => {
    const {cowinData} = this.state

    return (
      <>
        <VaccinationCoverage
          vaccinationCoverageDetails={cowinData.last7DaysVaccination}
        />
        <VaccinationByGender
          vaccinationByGenderDetails={cowinData.vaccinationByGender}
        />
        <VaccinationByAge
          vaccinationByAgeDetails={cowinData.vaccinationByAge}
        />
      </>
    )
  }

  renderLoadingView = () => (
    // below comment used to disable eslint for testid line
    // eslint-disable-next-line react/no-unknown-property
    <div className="loading-view" testid="loader">
      <Loader color="#ffffff" height={80} type="ThreeDots" width={80} />
    </div>
  )

  renderCowinDashBoard = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderVaccinationStats()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="cowin-dashboard-container">
          <div className="logo-container">
            <img
              className="logo"
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
            />
            <h1 className="logo-heading">Co-WIN</h1>
          </div>
          <h1 className="heading">CoWIN Vaccination in India</h1>
          {this.renderCowinDashBoard()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
