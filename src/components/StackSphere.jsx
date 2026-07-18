import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { profile, stackNodes } from '../data/content'

function makeLabelSprite(text, color = '#e7e3d8', size = 64) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const padding = 16
  ctx.font = `${size}px 'IBM Plex Mono', monospace`
  const textWidth = ctx.measureText(text).width
  canvas.width = textWidth + padding * 2
  canvas.height = size + padding * 2
  ctx.font = `${size}px 'IBM Plex Mono', monospace`
  ctx.fillStyle = color
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false })
  const sprite = new THREE.Sprite(material)
  const aspect = canvas.width / canvas.height
  const spriteHeight = 0.6
  sprite.scale.set(spriteHeight * aspect, spriteHeight, 1)
  return sprite
}

export default function StackSphere() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const width = mount.clientWidth
    const height = mount.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 12)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    const group = new THREE.Group()
    scene.add(group)

    const centerGeo = new THREE.SphereGeometry(0.7, 32, 32)
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0xd4a656,
      emissive: 0xb98b3d,
      emissiveIntensity: 0.4,
      roughness: 0.4,
      metalness: 0.2,
    })
    const centerSphere = new THREE.Mesh(centerGeo, centerMat)
    group.add(centerSphere)

    const centerLabel = makeLabelSprite(profile.name.split(' ')[0], '#0e1420', 72)
    centerLabel.position.set(0, 0, 0.9)
    centerLabel.scale.multiplyScalar(1.1)
    group.add(centerLabel)

    const radius = 2.6
    const count = stackNodes.length
    const nodeGroup = new THREE.Group()
    group.add(nodeGroup)

    const goldenAngle = Math.PI * (3 - Math.sqrt(5))

    stackNodes.forEach((label, i) => {
      const y = count > 1 ? 1 - (i / (count - 1)) * 2 : 0
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = goldenAngle * i
      const x = Math.cos(theta) * radiusAtY
      const z = Math.sin(theta) * radiusAtY

      const pos = new THREE.Vector3(x, y, z).multiplyScalar(radius)

      const nodeGeo = new THREE.SphereGeometry(0.32, 24, 24)
      const nodeMat = new THREE.MeshStandardMaterial({
        color: 0x141b2b,
        roughness: 0.6,
      })
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat)
      nodeMesh.position.copy(pos)
      nodeGroup.add(nodeMesh)

      const edges = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.34, 1))
      const edgeLine = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0xb98b3d, transparent: true, opacity: 0.5 })
      )
      edgeLine.position.copy(pos)
      nodeGroup.add(edgeLine)

      const label3d = makeLabelSprite(label)
      label3d.position.copy(pos.clone().multiplyScalar(1.3))
      nodeGroup.add(label3d)

      const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), pos])
      const lineMat = new THREE.LineDashedMaterial({
        color: 0xb98b3d,
        dashSize: 0.15,
        gapSize: 0.1,
        transparent: true,
        opacity: 0.45,
      })
      const line = new THREE.Line(lineGeo, lineMat)
      line.computeLineDistances()
      nodeGroup.add(line)
    })

    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const point = new THREE.PointLight(0xd4a656, 1.2)
    point.position.set(4, 4, 4)
    scene.add(point)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableZoom = false
    controls.enablePan = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 1.1
    controls.enableDamping = true
    controls.dampingFactor = 0.08

    let frameId
    function animate() {
      controls.update()
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    animate()

    function handleResize() {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(frameId)
      controls.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} className="stack-sphere-mount" />
}