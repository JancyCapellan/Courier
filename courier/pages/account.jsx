// import { useAuth } from '../contexts/authContext'
import Sidebar from '../components/Sidebar'
import router from 'next/router'
import ReloadButton from '../components/ReloadButton'
// import { useSession } from 'next-auth/react'
import { useSession } from '../customHooks/useSession'
import Layout from '../components/Layout'

// accout information, place to change information, recent orders, settings
// change payment types, add addresses, change phone numbers, send messages

const AccountInfo = () => {
  // const { firstName, email, lastName } = useAuth()
  const [session, loading] = useSession()
  console.log(session)

  let show = false
  if (!loading) {
    show = true
    const { firstName, lastName, role, email, name } = session.user
    return (
      <>
        <div className='accountPage'>
          {show ? (
            <section className='accInfoPanel'>
              <h1> Account Information</h1>
              <table className='accInfoTable'>
                <thead>
                  <tr>
                    <th>Full Name:</th>
                    <td> {name}</td>
                  </tr>
                  <tr>
                    <th>Email: </th>
                    <td>{email}</td>
                  </tr>
                  <tr>
                    <th>Role: </th>
                    <td>{role}</td>
                  </tr>
                  <tr>
                    <th>Address: </th>
                    <td>123 Test st ave, ny, ny, 10087</td>
                  </tr>
                </thead>
              </table>
              <br />
            </section>
          ) : (
            <></>
          )}
        </div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae aliquid recusandae itaque,
          est incidunt modi repellat iste sint magni maxime, sapiente nam, temporibus quos nisi
          libero! Quia laborum possimus saepe voluptatum, repudiandae iusto rerum illo distinctio
          cum, necessitatibus molestiae est deleniti facilis ab. Dolorem, est natus! Assumenda vitae
          totam reiciendis quas inventore aperiam, esse ab deleniti porro tempora quaerat nostrum
          distinctio rem dolores atque laborum, ex velit fugit repellendus odit quis soluta
          obcaecati nesciunt explicabo. Odit earum doloribus, dicta qui excepturi cupiditate fugit.
          Quia esse omnis accusamus expedita, nisi, aliquid eos a sint porro aperiam facilis fuga!
          Voluptatibus, neque molestiae. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Est, alias vero. Libero cum, sint autem dignissimos eos quo voluptatum cumque ad
          perspiciatis, quam quod. Dignissimos minus, molestias assumenda iure suscipit architecto,
          ea delectus et temporibus recusandae aut impedit reprehenderit eos? Magnam pariatur
          deserunt quod consequuntur. Dolorum libero, possimus labore obcaecati atque minus iure
          sit? Enim, illo quam. Quos quae quidem reprehenderit natus voluptatum, dolor accusamus
          deserunt quasi rerum architecto, aperiam culpa omnis officiis ea, molestias cum corporis
          vero veritatis ad beatae officia nemo dolorem ab! Vel quaerat excepturi natus sed ad
          consequuntur, ut earum, laudantium in ipsa temporibus velit ex. Deserunt non quisquam quae
          in nobis, nesciunt ea natus molestias aperiam placeat assumenda consequatur amet sequi
          quia totam at dignissimos aspernatur ratione perferendis quaerat quod error quo? Delectus
          qui consequuntur est. Neque sapiente hic aspernatur, pariatur quis deleniti doloribus
          autem repellat vero quas, quam beatae sunt perferendis laboriosam accusamus repudiandae.
          Ducimus, voluptate ipsam? Nisi aut atque nam ad, corrupti nulla! Esse dignissimos earum
          beatae, sint porro, corrupti voluptatem eum fugiat aliquam, blanditiis iure voluptatibus
          repellendus minima! Laboriosam eveniet maiores id, minus enim laudantium eius! Sed iste
          odio et blanditiis deserunt voluptatibus pariatur repellat error quibusdam! Dicta
          repellendus fuga omnis et ducimus. Velit voluptatem repellendus fugiat quis praesentium
          amet beatae molestias harum neque. Excepturi minus, maiores veritatis quaerat aspernatur
          recusandae laborum minima magni placeat ut illo nihil reprehenderit at expedita ab
          possimus, dolorum eum vero? Accusantium doloremque iusto laboriosam nisi veniam alias
          fugiat ipsum fuga praesentium, error corporis. Deserunt non voluptatum soluta officia.
          Facere dolorum iure ea nisi error non recusandae doloribus, odit neque quisquam, magnam
          harum veniam distinctio adipisci nam libero. Mollitia, maiores ratione dolorum praesentium
          excepturi laboriosam optio omnis accusamus, maxime saepe accusantium nam dolorem ipsum
          odit, alias quia. Ipsum distinctio quia commodi exercitationem. Velit rerum perferendis,
          quasi vel incidunt error autem aliquid suscipit nisi molestiae ducimus beatae quas minima
          sequi? Nisi impedit soluta quam non cumque illo aspernatur, quia dolorem! Doloremque
          officiis ipsum praesentium dicta modi odit ad itaque illum pariatur, nihil a doloribus
          quasi excepturi natus ratione voluptas perspiciatis vitae quas fugiat nam distinctio
          adipisci voluptatem. Accusantium reprehenderit voluptas aut magnam, veritatis inventore
          recusandae accusamus voluptatum? Culpa debitis consectetur natus mollitia commodi facilis
          distinctio voluptates iste at aliquid velit, vitae in officiis maiores doloremque, dolor
          error quos voluptatibus deserunt ducimus beatae neque deleniti ab! Error deserunt quasi
          provident! Sapiente possimus consequatur repellendus. Maiores aut exercitationem aperiam
          recusandae illum. Eos delectus nihil ab hic repudiandae nobis commodi ratione expedita
          vero, voluptatibus, iure nesciunt aperiam, id cum illo ullam fugiat deleniti consequuntur
          qui doloribus. Illum veritatis minus inventore molestiae maxime, aspernatur nulla fugiat?
          Soluta blanditiis ratione minus sit, ex, officiis labore consectetur animi similique fugit
          at ipsam molestiae eveniet quisquam cupiditate inventore voluptatibus dignissimos sed
          dolorem non iusto! Officia odio eligendi voluptatum architecto placeat! Atque possimus
          voluptas vitae dolore iusto magni ex, explicabo sunt placeat, dignissimos fugiat tempora
          ullam tenetur pariatur. Tempora quam corporis consequuntur odio temporibus enim placeat
          fuga aliquid doloribus, accusantium error esse pariatur est eaque odit molestias.
          Consectetur, mollitia similique nam nihil error quam pariatur voluptatum neque veniam!
          Ullam doloribus quam qui assumenda eveniet, fugit sit? Iure, illo. Rem et consequuntur
          veniam cupiditate obcaecati adipisci corrupti maxime, vero cum nemo aperiam unde aliquam
          maiores! Provident, rerum! Nesciunt perspiciatis blanditiis voluptatem quas nisi, optio
          deleniti ut odio quia, repellat officiis eum dolore. Quod autem a nihil optio sunt
          doloremque, quas tempora, reiciendis at ad voluptatem suscipit fugiat. Laboriosam, vitae
          recusandae perferendis cupiditate neque earum exercitationem repellat dicta quasi numquam
          aliquam corporis qui, voluptas illo vel. Unde consequuntur vel eveniet ducimus quo animi
          ipsa iusto nobis delectus quibusdam id, numquam minima obcaecati ea accusamus expedita
          rerum magni asperiores quaerat voluptates quisquam dignissimos vero quis architecto.
          Beatae mollitia nesciunt eveniet deserunt maiores labore vitae architecto nihil
          praesentium tenetur porro deleniti eligendi fuga, perspiciatis omnis vel in quae
          repudiandae consectetur nostrum soluta illum. Libero eos eaque quis omnis, cum nulla,
          dolor molestiae, aliquid soluta atque dolorum? Velit provident recusandae nisi nam maxime
          consequuntur. Laboriosam accusantium voluptatibus officiis quibusdam. Suscipit beatae
          pariatur maxime distinctio natus odit reprehenderit libero dolorem soluta delectus magnam
          nulla possimus nam at error expedita placeat qui quae nesciunt, optio iusto harum saepe
          non? Inventore architecto culpa odit aspernatur ut ratione rem eos facere in! Corrupti
          aliquam nostrum optio? Fuga ipsam est laudantium sit harum, eos nostrum magni maiores
          expedita quisquam quam ab possimus aspernatur sint sed laboriosam temporibus dolorum quis
          repudiandae exercitationem. Odit ut neque eveniet quaerat non aperiam provident in
          asperiores! Labore, officiis in voluptas harum quia earum cum necessitatibus similique
          blanditiis quae tempore aliquam hic deserunt nulla ducimus sequi consequuntur soluta
          magnam excepturi placeat perferendis dolorem nihil. At quasi dicta inventore soluta animi
          minima in sunt tempore temporibus reiciendis labore a fugit, perspiciatis porro vitae ea.
          Veritatis libero iusto optio. Unde, reiciendis ad voluptate, quas repellendus animi
          voluptatem debitis quaerat aperiam fugit optio accusantium temporibus deleniti, qui sint
          alias. Eaque ratione nemo ad facere dolore hic minus magni necessitatibus aliquam quas
          fugiat rerum provident qui soluta similique unde aut praesentium exercitationem in ipsam
          vero, totam facilis quos? Nesciunt, placeat tempora! Nam quae obcaecati autem at esse
          nostrum necessitatibus odit facere itaque dolor temporibus, quod ullam aut fuga. Tempore
          dignissimos earum esse sapiente consequatur in rem ipsum deserunt totam eum cum, nihil
          eveniet facilis praesentium incidunt obcaecati expedita illum adipisci inventore excepturi
          est odit? Repudiandae voluptatum unde ipsum! Ipsam voluptate hic, ea beatae corrupti est.
          Architecto ratione ex vitae quibusdam modi provident, ut est odit, illum dicta corrupti
          voluptate, vel consequuntur voluptatum error sit at rem! Atque tenetur temporibus eos,
          dolores pariatur voluptatum. Laboriosam in ipsa vitae consectetur, architecto neque?
          Beatae nihil doloremque, sunt quaerat saepe modi inventore magnam reprehenderit impedit,
          dicta error harum veritatis, tempore ipsum? Tenetur quia ab odit illo eum blanditiis ipsam
          deleniti et voluptatem laudantium. Labore, iure tenetur nemo molestias nam quod ut in
          magni dolores unde alias itaque aliquam nesciunt sit delectus amet doloribus esse
          perferendis hic? Possimus aperiam magni ad nam molestias perspiciatis odio, minima
          assumenda explicabo? Explicabo, atque in!
        </p>
        <ReloadButton />
      </>
    )
  }
  // const { firstName, lastName } = session.userInfo

  //use effect to get user info from database
  return (
    <>
      <div className='accountPage'>
        {show ? (
          <section className='accInfoPanel'>
            <h1> Account Information</h1>
            <table className='accInfoTable'>
              <thead>
                <tr>
                  <th>Full Name:</th>
                  {/* <td> {name}</td> */}
                </tr>
                <tr>
                  <th>Email: </th>
                  {/* <td>{email}</td> */}
                </tr>
                <tr>
                  <th>Role: </th>
                  {/* <td>{role}</td> */}
                </tr>
                <tr>
                  <th>Address: </th>
                  <td>123 Test st ave, ny, ny, 10087</td>
                </tr>
              </thead>
            </table>
          </section>
        ) : (
          <></>
        )}
      </div>
      <ReloadButton />
    </>
  )
}

export default AccountInfo

AccountInfo.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
