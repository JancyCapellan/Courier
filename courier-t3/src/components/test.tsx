const obj = { counter: 0 }
if (1) {
  obj.counter = 1
}

const testComponent = () => {
  return (
    <>
      <ModalContainer></ModalContainer>
    </>
  )
}

const MyArrayComponent = () => Array(5).fill(<div />) as any as JSX.Element
export const name = 'test'
