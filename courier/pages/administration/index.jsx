import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import RegistrationForm from '../../components/RegistrationForm.jsx'
import ModalContainer from '../../components/HOC/ModalContainer'
import axios from 'axios'
import { useRouter } from 'next/router'

export const getServerSideProps = async ({ res }) => {
  try {
    const result = await axios.post(`http://localhost:3000/user/allDrivers`)
    console.log('response', result.data)
    return {
      props: {
        drivers: result.data,
      },
    }
  } catch (error) {
    res.statusCode = 500
    console.log('getcustomer', error)
    return {
      props: {},
    }
  }
}

const Administration = ({ drivers }) => {
  const [branch, setBranch] = useState()
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  const handleModalClose = () => setShowModal(false)

  const BranchOfficeData = (branch) => {
    return (
      <section>
        <section></section>
      </section>
    )
  }

  console.log('drivers', drivers)

  function openDriverPage(driverId) {
    console.log('open driver page')
    router.push({
      pathname: `/administration/${driverId}`,
    })
  }

  const Drivertable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>driver name</th>
            <th>packages assigned today</th>
            <th>branch name</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => {
            return (
              <tr onClick={() => openDriverPage(driver.id)} key={driver.id}>
                <td>
                  {driver.firstName} {driver.lastName}
                </td>
                <td></td>
                <td>{driver.branchName}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  return (
    <Sidebar>
      <section>
        <h1>Staff Manager</h1>
        <ModalContainer show={showModal} handleClose={handleModalClose}>
          <RegistrationForm staff={true} />
        </ModalContainer>

        <button className='btn add-customer-btn' onClick={() => setShowModal(true)}>
          Create Staff
        </button>
      </section>
      <Drivertable />
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor necessitatibus beatae
        voluptatem, molestiae alias rem ab, doloribus perspiciatis reiciendis perferendis nihil fuga
        nostrum quos ullam repellat quisquam delectus laboriosam qui. Ducimus ullam soluta, quasi
        dolores et praesentium? Debitis delectus pariatur dolor officiis. Aspernatur laudantium
        voluptate harum officia maiores incidunt consectetur fugiat in! Dolorem praesentium ab
        eligendi quia doloribus. Molestiae, omnis. Quis atque esse error incidunt qui necessitatibus
        harum laborum velit suscipit, quas voluptate voluptatum odio beatae rerum magnam possimus
        sunt, ad assumenda blanditiis cum sint, molestiae tempora? Non, ex magni! Minus modi labore
        commodi? Veritatis, enim error laudantium sed sunt, id at fugit aspernatur modi doloribus ab
        quae quas nobis. Quibusdam earum doloribus enim voluptatem quia eveniet maiores, recusandae
        corporis. Modi officiis maiores et explicabo voluptate eos in, impedit porro dignissimos id!
        Repellendus porro et accusamus aut incidunt velit eius sit dolorum. Consequuntur, dolor sunt
        quisquam recusandae minus facere nemo. Facere corporis possimus illum, illo at ut
        exercitationem velit. Id harum delectus voluptate? Voluptatum, fuga modi dolores, reiciendis
        enim quam, explicabo optio dolore beatae dolorum quisquam eum eveniet cum porro? Dicta
        dolore iure, recusandae dignissimos nam temporibus assumenda nihil dolorum ab voluptatem
        quibusdam provident aperiam veniam magnam eos? Similique, autem reprehenderit. Dolor
        deserunt aliquam ex fugit eveniet corporis quam ullam. Consequuntur quidem at ducimus, unde
        aliquid sequi ab repellendus sunt, aperiam, quos iure iusto excepturi veritatis! Consequatur
        tempora magni veniam nisi illum corporis aliquid et quaerat sit. Voluptatum, repellat autem.
        Veritatis ipsum nulla, nisi, illo aperiam odio facilis distinctio similique cumque id hic
        error. Quam enim incidunt quis nesciunt optio explicabo quibusdam, facilis nostrum dolorem
        vel blanditiis ex maiores consequuntur? Tenetur quod accusantium consequatur, excepturi illo
        ipsa sint error beatae rem optio voluptate in cum provident, neque praesentium voluptates.
        Delectus dolorum praesentium odit asperiores, unde corporis velit recusandae placeat
        officiis. Ullam magnam obcaecati dolorem rem eaque, dicta quo dolorum magni hic quidem.
        Doloremque dolorem autem quisquam minima eum eius. Omnis exercitationem, provident
        laboriosam ex enim ut. Dolore corporis quo hic. Unde eius animi quae a quasi error assumenda
        accusamus. Quaerat totam provident labore doloremque? Blanditiis corrupti doloribus facilis
        perferendis id repudiandae animi aspernatur, ad consectetur iste accusantium necessitatibus
        iure voluptate. Recusandae, animi? Minus quibusdam illo repellendus eveniet dolorem
        recusandae officia nam suscipit deleniti? Nemo voluptate omnis consequuntur libero vel ea!
        Harum autem laborum totam consectetur ipsa maiores, necessitatibus eos dolore! Eos, sunt
        deserunt tenetur odio iusto totam consequatur odit assumenda. Nostrum animi quis molestiae?
        Explicabo, quaerat excepturi et vero atque alias consequuntur iure corrupti deserunt
        doloribus optio, quisquam nesciunt sed. Cum illo iste, fuga nulla pariatur, consectetur
        tempore reiciendis totam dicta architecto nobis perferendis deserunt harum at id temporibus
        minus eos magni voluptates hic doloribus voluptate! Quisquam dolor vero eveniet! Totam eum
        esse optio pariatur facilis iure autem voluptatem unde porro cumque et sint laudantium at
        explicabo quo, non dolorem. Perspiciatis blanditiis, reiciendis nesciunt sint distinctio
        accusantium totam iure voluptas. Debitis voluptate ducimus maxime voluptatum deserunt quas
        excepturi non asperiores ea possimus blanditiis aperiam repellat veniam reprehenderit
        deleniti at suscipit fugit, mollitia repudiandae! Corrupti earum in, sed quasi nisi
        suscipit. Id magnam dolorem commodi facere reprehenderit quas aliquid perferendis esse ipsam
        eligendi? Molestiae non neque quis voluptatibus. Iusto, tempore voluptatum. Consequuntur,
        temporibus harum obcaecati dolor dignissimos repellat id incidunt soluta! Numquam laudantium
        quasi magnam nesciunt odit inventore rerum vero distinctio aperiam iusto corrupti nemo
        dolorum cupiditate quaerat, ad exercitationem ut ea neque, eveniet at culpa reiciendis hic
        quisquam sed! Amet! Rem minima numquam provident quo consectetur autem debitis cumque, hic
        reprehenderit perspiciatis laudantium consequatur eligendi mollitia dolor repudiandae esse
        blanditiis placeat optio dolorem dolorum qui soluta, porro culpa! Eum, quasi. Molestiae
        itaque suscipit obcaecati quod? Libero aperiam non suscipit ipsa mollitia, eum animi
        inventore dolor labore doloribus quibusdam error molestias? Assumenda eos modi consequatur
        eaque vel nemo facere, ratione non! Soluta totam, odio qui ab maiores provident iusto
        repudiandae sit vitae dolorum, nulla molestiae est accusantium dolore error. Error a neque
        officia amet officiis tempora dolorum harum sequi quod non. Ex libero culpa doloremque
        temporibus nulla delectus corrupti quis sint. Est distinctio dolor, facilis nostrum
        praesentium autem quasi quibusdam fugit ad laborum dignissimos, quam explicabo eum magni
        voluptas aliquam exercitationem. Sunt id iure cumque nostrum eius natus similique totam
        culpa magnam, at ratione autem dolor maxime animi dignissimos tempora sint possimus porro,
        exercitationem vero sapiente repellat nam. A, cupiditate quam! Dolorem dicta dolore, libero
        eaque sequi numquam eius assumenda error veniam sint, impedit ratione. Consequatur, omnis,
        aperiam cupiditate provident sint quod possimus ut exercitationem, ducimus ex eaque nesciunt
        veritatis accusamus? Quas quasi tempora facere atque eligendi, dolorum exercitationem
        quisquam et nostrum porro, maxime earum laboriosam, dicta repudiandae. Officia corrupti eius
        quam voluptas sunt necessitatibus, dolorem ipsum harum, obcaecati animi fugit! Laudantium,
        deleniti itaque sit laboriosam minima ex vel ut reprehenderit totam voluptatem et,
        necessitatibus quisquam dicta repellendus commodi saepe neque. Cum animi ad consectetur
        voluptatum accusantium adipisci esse culpa quis. Praesentium velit dolorum commodi deleniti
        quaerat quas, rem alias exercitationem, autem ratione sequi numquam. Nulla consectetur nihil
        explicabo. Rem placeat natus quod cumque autem, molestiae nisi nulla ut libero quidem. Modi
        dolore repellat, incidunt quos tempora in. Harum voluptas repellat modi. Quae repudiandae
        dignissimos impedit alias illo perspiciatis ea delectus! Magni velit, nisi dolor officiis
        deserunt pariatur totam molestias eos. Id, at fugit! Maiores eos, aperiam dolores a
        repellendus eius dicta nesciunt quis adipisci sunt distinctio nostrum consequatur at atque
        et quo explicabo error sapiente iusto! Incidunt vitae modi atque. Consequatur aut earum
        molestias dolorum suscipit, cum ducimus nihil excepturi ullam blanditiis atque. Dolores sint
        ex magnam, nobis dolor architecto, illum veritatis at quae quisquam quas repellendus non
        eius? Dolor! Culpa ab totam esse error minus temporibus, animi, voluptatum provident minima
        in nesciunt commodi, amet aperiam libero accusamus. Aliquam voluptates consequuntur
        explicabo quibusdam libero exercitationem temporibus quas repudiandae voluptatem nisi! Et
        veniam modi repellendus nemo corporis molestiae impedit vitae ratione, molestias sed
        similique quo quidem cum nobis beatae veritatis enim explicabo voluptatem. Accusamus dolorum
        quae culpa adipisci quisquam quas eveniet! Soluta ullam cumque explicabo suscipit ipsa velit
        vitae quibusdam facere ea minus consequuntur, mollitia, omnis animi harum nisi reiciendis
        provident in unde dolor commodi temporibus quas necessitatibus nam veritatis. Autem.
        Similique esse assumenda provident in dolore nihil nemo voluptatum sapiente maxime possimus
        deleniti cumque veniam iure aperiam est nam laboriosam animi laudantium sit itaque non,
        sequi voluptatem deserunt? Doloremque, esse. Porro eius autem corrupti quis consequatur
        delectus ea debitis voluptatibus cupiditate optio, repudiandae consequuntur, enim hic
        aspernatur magni quibusdam odio in est ut quaerat distinctio quasi voluptate minus placeat.
        Placeat! Culpa asperiores quos maiores adipisci rem fugit dolore. Similique commodi quos aut
        praesentium ducimus recusandae architecto culpa aspernatur corporis iure error adipisci amet
        eius, distinctio quam sit. Ipsam, iusto minus! Saepe veniam quo sed animi at eligendi cum
        qui nam laudantium tempore debitis labore obcaecati esse, alias minus, necessitatibus
        accusamus ea! Quibusdam repudiandae ex perferendis ut ipsum quasi sed illum. Dignissimos,
        ipsa? Provident eveniet est dolorem recusandae quae. Eum nulla quas rem maiores numquam
        possimus eaque quia voluptatem, minus id error assumenda porro dolorem voluptatum sunt quos
        debitis, repellat alias. Velit ea repudiandae error voluptatibus eius rerum officiis neque
        distinctio dolores molestias alias, modi, facere voluptatem, iure animi a magni! Impedit
        earum tempora quis corporis obcaecati dicta, enim deleniti est. Non, incidunt! Officia
        doloribus ad, iusto nemo, exercitationem consequuntur dolorem delectus deserunt voluptatem
        quae velit voluptates nostrum aut at. Autem, sequi? Non cum quis commodi minus nesciunt
        beatae accusantium dolore. Excepturi corrupti, eaque qui perspiciatis, cumque tempora
        distinctio dignissimos blanditiis, temporibus repellat a modi nulla voluptate illum! Nihil
        a, itaque, ab molestias tempore cupiditate, similique repudiandae repellat ad quod omnis.
        Rerum minus perferendis soluta quidem excepturi velit nihil deleniti ut dolorum, rem at
        laudantium, dolore sint voluptas? Delectus eligendi excepturi nam enim hic, sapiente
        temporibus architecto ut ratione ullam ipsa. Suscipit iste tempora odio doloremque
        consequuntur quia maxime sapiente nam neque, nulla impedit aliquam error corporis! Aperiam
        nihil ea, iste aut aliquid sit nobis aliquam, ullam cumque doloremque numquam obcaecati!
        Voluptates non reiciendis tempore sed fuga saepe aperiam cum architecto dolores maiores,
        voluptatibus laboriosam facere doloribus! Aut excepturi optio commodi quod saepe. Magni
        numquam ipsa voluptate provident ea, perspiciatis ab. Saepe eveniet repellendus totam
        recusandae praesentium cupiditate magnam provident maxime voluptatibus. Dolores quos eum a
        placeat, vitae id qui mollitia cum unde? Sint saepe, culpa similique a deserunt animi quam!
        Porro adipisci cum temporibus eius veritatis eligendi quo, facere aut? Qui cum dolor quos
        repellendus optio nulla quo quisquam, suscipit nam nesciunt et a delectus. Enim harum
        possimus voluptatibus ipsa! Doloremque, molestias cupiditate non aspernatur facilis quidem
        fugiat dolores quos odio, perferendis nobis molestiae officia, sint magnam deserunt tempora?
        Nemo aliquid culpa autem doloribus quae odio accusamus quidem ab consequatur. Dignissimos
        consequuntur accusamus incidunt dicta nostrum. Libero optio similique est obcaecati alias.
        Assumenda dolorum blanditiis possimus, fugiat distinctio quam sint aliquam, velit odio vitae
        repudiandae aut tempore! Ipsum, iusto neque. Ea perspiciatis voluptates impedit rem cum
        illum sint atque earum autem nobis voluptatem alias perferendis maiores ratione, dolorum
        exercitationem odit facilis quas, unde quis fugit ipsum suscipit recusandae mollitia?
        Consequatur?
      </div>
    </Sidebar>
  )
}

export default Administration
