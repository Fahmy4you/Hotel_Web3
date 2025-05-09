import * as THREE from 'three'
import React from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    defaultMaterial: THREE.Mesh
    defaultMaterial_1: THREE.Mesh
    defaultMaterial_2: THREE.Mesh
    defaultMaterial_3: THREE.Mesh
    defaultMaterial_4: THREE.Mesh
    defaultMaterial_5: THREE.Mesh
    defaultMaterial_6: THREE.Mesh
    defaultMaterial_7: THREE.Mesh
    defaultMaterial_8: THREE.Mesh
    defaultMaterial_9: THREE.Mesh
    defaultMaterial_10: THREE.Mesh
    defaultMaterial_11: THREE.Mesh
    defaultMaterial_12: THREE.Mesh
  }
  materials: {
    details_3: THREE.MeshStandardMaterial
    hotel: THREE.MeshStandardMaterial
    hotel_2: THREE.MeshStandardMaterial
    hotel_1_2: THREE.MeshStandardMaterial
    details: THREE.MeshStandardMaterial
    details_2: THREE.MeshStandardMaterial
    lights: THREE.MeshStandardMaterial
    terrain: THREE.MeshStandardMaterial
    ship_fly: THREE.MeshStandardMaterial
    carousel: THREE.MeshStandardMaterial
    train: THREE.MeshStandardMaterial
    ship: THREE.MeshStandardMaterial
  }
  animations: THREE.AnimationClip[]
}

export function HotelModel(props: React.ComponentProps<'group'>) {
  const { nodes, materials } = useGLTF('/model/hotelhome.glb') as unknown as GLTFResult
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh geometry={nodes.defaultMaterial.geometry} material={materials.details_3} />
          <mesh geometry={nodes.defaultMaterial_1.geometry} material={materials.hotel} />
          <mesh geometry={nodes.defaultMaterial_2.geometry} material={materials.hotel_2} />
          <mesh geometry={nodes.defaultMaterial_3.geometry} material={materials.hotel_1_2} />
          <mesh geometry={nodes.defaultMaterial_4.geometry} material={materials.details} />
          <mesh geometry={nodes.defaultMaterial_5.geometry} material={materials.details} />
          <mesh geometry={nodes.defaultMaterial_6.geometry} material={materials.details_2} />
          <mesh geometry={nodes.defaultMaterial_7.geometry} material={materials.lights} />
          <mesh geometry={nodes.defaultMaterial_8.geometry} material={materials.terrain} />
          <mesh geometry={nodes.defaultMaterial_9.geometry} material={materials.ship_fly} />
          <mesh geometry={nodes.defaultMaterial_10.geometry} material={materials.carousel} />
          <mesh geometry={nodes.defaultMaterial_11.geometry} material={materials.train} />
          <mesh geometry={nodes.defaultMaterial_12.geometry} material={materials.ship} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/model/hotelhome.glb')
