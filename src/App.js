import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment, useGLTF } from '@react-three/drei'
import { proxy, useSnapshot } from 'valtio';
import { HexColorPicker } from 'react-colorful';

const state = proxy({
  current: null,
  items: {
    outline: "#fff",
    skin: '#fff',
    black_plactic: '#fff',
    pillow_skin: '#fff',
  },
  names:{
    skin: "Skin",
    outline: 'Outline',
    black_plactic: 'Plastic',
    pillow_skin: 'Pillow',
  }
})


export default function App() {
  return (
    <>

      <Canvas camera={{ position: [0, 3, 4] }} color='blue'>
        <ambientLight intensity={0.3} />
        <spotLight intensity={0.3} angle={0.1} penumbra={1} position={[10, 15, 10]} castShadow />
        {/* <ShoeModel ></ShoeModel> */}
        <ChairModel></ChairModel>
        <Environment preset="city" />
        <ContactShadows frames={1} scale={10} opacity={.25} position={[0, -1, 0]}></ContactShadows>
        <OrbitControls minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
      </Canvas >
      <Picker></Picker>

    </>
  )
}


function Picker() {
  const snap = useSnapshot(state);
  return (<div style={{ display: snap.current ? "block" : "none" }}>
    <HexColorPicker className="picker" color={snap.items[snap.current]} onChange={(color) => (state.items[snap.current] = color)} />
    <h1>{snap.names[snap.current]}</h1>
  </div>)
}


function ChairModel(props) {
  const { nodes, materials } = useGLTF('/chair.glb')
  const [hovered, setHovered] = useState(null)
  const snap = useSnapshot(state);
  const ref = useRef();

  console.log( {nodes, materials})

  useFrame(state => {
   
    const t = state.clock.getElapsedTime();
    // ref.current.rotation.set(Math.cos(t / 4) / 8, Math.sin(t / 4) / 8, -0.2 - (1 + Math.sin(t / 1.5)) / 20)
    ref.current.position.y = (-2 + Math.sin(t / 3) * 0.5) / 4
  })

  useEffect(() => {
   
    const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${snap.items[hovered]}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="#fff-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="35" y="63">${snap.names[hovered]}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`
    const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`
    if (hovered) {
      document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(cursor)}'), auto`
      return () => (document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(auto)}'), auto`)
    }
  }, [hovered])

  return (
    <group ref={ref} onPointerOver={(e) => (e.stopPropagation(), setHovered(e.object.material.name))}
      onPointerOut={(e) => e.intersections.length === 0 && setHovered(null)}
      onPointerMissed={() => (state.current = null)}
      onClick={(e) => (e.stopPropagation(), (state.current = e.object.material.name))}
      {...props} dispose={null}>
      <mesh  material-color={snap.items.outline} geometry={nodes.outline.geometry} material={materials.outline} />
      <mesh  material-color={snap.items.skin} geometry={nodes.seatside.geometry} material={materials.skin} />
      <mesh  material-color={snap.items.black_plactic} geometry={nodes.foot.geometry} material={materials.black_plactic} />
      <mesh  material-color={snap.items.black_plactic} geometry={nodes.footBase.geometry} material={materials.black_plactic} />
      <mesh  material-color={snap.items.black_plactic} geometry={nodes.height_adjust.geometry} material={materials.black_plactic} />
      <mesh  material-color={snap.items.skin} geometry={nodes.seat.geometry} material={materials.skin} />
      <mesh  material-color={snap.items.black_plactic} geometry={nodes.wheel.geometry} material={materials.black_plactic} />
      <mesh  material-color={snap.items.skin} geometry={nodes.arm.geometry} material={materials.skin} />
      <mesh  material-color={snap.items.pillow_skin} geometry={nodes.backCut.geometry} material={materials.pillow_skin} />
      <mesh  material-color={snap.items.black_plactic} geometry={nodes.base.geometry} material={materials.black_plactic} />
      <mesh  material-color={snap.items.skin} geometry={nodes.backrest.geometry} material={materials.skin} />
      <mesh  material-color={snap.items.skin} geometry={nodes.strip.geometry} material={materials.skin} />
      <mesh  material-color={snap.items.skin} geometry={nodes.handrest.geometry} material={materials.skin} />
    </group>
  )
}

// function ShoeModel(props) {
//   const { nodes, materials } = useGLTF('/shoe.glb')
//   const [hovered, setHovered] = useState(null)
//   const snap = useSnapshot(state);
//   const ref = useRef();
//   useFrame(state => {
//     console.log('frame', ref)
//     const t = state.clock.getElapsedTime();
//     ref.current.rotation.set(Math.cos(t / 4) / 8, Math.sin(t / 4) / 8, -0.2 - (1 + Math.sin(t / 1.5)) / 20)
//     ref.current.position.y = (1 + Math.sin(t / 3)) / 4
//   })

//   useEffect(() => {
//     const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${snap.items[hovered]}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="#fff-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="35" y="63">${hovered}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`
//     const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`
//     if (hovered) {
//       document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(cursor)}'), auto`
//       return () => (document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(auto)}'), auto`)
//     }
//   }, [hovered])

//   return (
//     <group ref={ref} {...props}
//       onPointerOver={(e) => (e.stopPropagation(), setHovered(e.object.material.name))}
//       onPointerOut={(e) => e.intersections.length === 0 && setHovered(null)}
//       onPointerMissed={() => (state.current = null)}
//       onClick={(e) => (e.stopPropagation(), (state.current = e.object.material.name))}
//       dispose={null}>
//       <mesh material-color={snap.items.laces} geometry={nodes.shoe.geometry} material={materials.laces} />
//       <mesh material-color={snap.items.mesh} geometry={nodes.shoe_1.geometry} material={materials.mesh} />
//       <mesh material-color={snap.items.caps} geometry={nodes.shoe_2.geometry} material={materials.caps} />
//       <mesh material-color={snap.items.inner} geometry={nodes.shoe_3.geometry} material={materials.inner} />
//       <mesh material-color={snap.items.sole} geometry={nodes.shoe_4.geometry} material={materials.sole} />
//       <mesh material-color={snap.items.stripes} geometry={nodes.shoe_5.geometry} material={materials.stripes} />
//       <mesh material-color={snap.items.band} geometry={nodes.shoe_6.geometry} material={materials.band} />
//       <mesh material-color={snap.items.patch} geometry={nodes.shoe_7.geometry} material={materials.patch} />
//     </group>
//   )
// }

