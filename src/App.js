// App.js
import React, { useState } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import './App.css';

// Define colors for tension extremes
const TENSION_COLORS = {
  timePerspective: {
    immediate: '#FF0000',    // Red
    longTerm: '#00FF00',     // Green
  },
  beneficiary: {
    individual: '#0000FF',   // Blue
    collective: '#FFA500',   // Orange
  },
  autonomy: {
    userChoice: '#FFFF00',   // Yellow
    aiGuidance: '#800080',   // Purple
  },
};

// Define the cube points with positions and labels, including risks and benefits
const points = [
  {
    position: [-1, -1, -1],
    label: 'User Choice, Individual, Immediate',
    risks: 'May lead to impulsive decisions favoring short-term gains over long-term benefits.',
    benefits: 'High personal freedom; immediate satisfaction; encourages personal responsibility.',
  },
  {
    position: [1, -1, -1],
    label: 'AI Guidance, Individual, Immediate',
    risks: 'Over-reliance on AI may diminish personal decision-making skills.',
    benefits: 'Quick, optimized suggestions; reduces decision fatigue; immediate personalized assistance.',
  },
  {
    position: [-1, 1, -1],
    label: 'User Choice, Collective, Immediate',
    risks: 'Individual actions may conflict with collective goals; lack of coordination.',
    benefits: 'Empowers community engagement; immediate societal impact; fosters social responsibility.',
  },
  {
    position: [1, 1, -1],
    label: 'AI Guidance, Collective, Immediate',
    risks: 'Possible erosion of individual autonomy; ethical concerns over AI decision-making.',
    benefits: 'Coordinated efforts for immediate societal benefits; efficient resource allocation.',
  },
  {
    position: [-1, -1, 1],
    label: 'User Choice, Individual, Long-Term',
    risks: 'Challenges in maintaining long-term commitment; may overlook societal implications.',
    benefits: 'Personal growth and self-actualization; aligns actions with long-term goals.',
  },
  {
    position: [1, -1, 1],
    label: 'AI Guidance, Individual, Long-Term',
    risks: 'Dependence on AI for life planning; potential misalignment with personal values.',
    benefits: 'Strategic planning assistance; personalized goal-setting; continuous support.',
  },
  {
    position: [-1, 1, 1],
    label: 'User Choice, Collective, Long-Term',
    risks: 'Difficulty in coordinating individual actions for long-term societal goals.',
    benefits: 'Empowers individuals to contribute to societal evolution; promotes civic engagement.',
  },
  {
    position: [1, 1, 1],
    label: 'AI Guidance, Collective, Long-Term',
    risks: 'Risk of centralization of power; ethical concerns over AI governance.',
    benefits: 'Efficient long-term planning for societal benefit; optimized resource management.',
  },
];

// Component for cube points with hover interactions
function CubePoint({ position, label, risks, benefits }) {
  const [hovered, setHover] = useState(false);

  return (
    <mesh
      position={position}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <sphereGeometry args={[0.07, 32, 32]} />
      <meshStandardMaterial color="white" />
      {hovered && (
        <Html distanceFactor={10}>
          <div className="hover-label">
            <h4>{label}</h4>
            <div className="hover-content">
              <p>
                <strong>Risks:</strong> {risks}
              </p>
              <p>
                <strong>Benefits:</strong> {benefits}
              </p>
            </div>
          </div>
        </Html>
      )}
    </mesh>
  );
}

// Component for axes with double arrows and labels
function Axis({ start, end, colorStart, colorEnd, label }) {
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);

  const dir = new THREE.Vector3().subVectors(endVec, startVec).normalize();
  const length = startVec.distanceTo(endVec);
  const position = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
  const axis = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, dir);

  // Label position at the positive end, slightly offset
  const labelPos = endVec.clone().add(dir.clone().multiplyScalar(0.2));

  return (
    <>
      {/* Axis line */}
      <mesh position={position.toArray()} quaternion={quaternion}>
        <cylinderGeometry args={[0.01, 0.01, length, 8]} />
        <meshStandardMaterial color="gray" />
      </mesh>
      {/* Arrowheads */}
      <mesh position={endVec.toArray()} quaternion={quaternion}>
        <coneGeometry args={[0.03, 0.1, 8]} />
        <meshStandardMaterial color={colorEnd} />
      </mesh>
      <mesh position={startVec.toArray()} quaternion={new THREE.Quaternion().setFromUnitVectors(axis, dir.clone().negate())}>
        <coneGeometry args={[0.03, 0.1, 8]} />
        <meshStandardMaterial color={colorStart} />
      </mesh>
      {/* Label at the positive end */}
      <Html position={labelPos.toArray()}>
        <div
          style={{
            color: 'black',
            fontSize: '12px',
            fontWeight: 'bold',
            textAlign: 'center',
            backgroundColor: 'white',
            padding: '2px 5px',
            borderRadius: '3px',
          }}
        >
          {label}
        </div>
      </Html>
    </>
  );
}

function Cube() {
  const materials = [
    // Right Face (+X): AI Guidance (Purple)
    new THREE.MeshBasicMaterial({ color: TENSION_COLORS.autonomy.aiGuidance, transparent: true, opacity: 0.4 }),
    // Left Face (-X): User Choice (Yellow)
    new THREE.MeshBasicMaterial({ color: TENSION_COLORS.autonomy.userChoice, transparent: true, opacity: 0.4 }),
    // Top Face (+Y): Collective (Orange)
    new THREE.MeshBasicMaterial({ color: TENSION_COLORS.beneficiary.collective, transparent: true, opacity: 0.4 }),
    // Bottom Face (-Y): Individual (Blue)
    new THREE.MeshBasicMaterial({ color: TENSION_COLORS.beneficiary.individual, transparent: true, opacity: 0.4 }),
    // Front Face (+Z): Long-Term (Green)
    new THREE.MeshBasicMaterial({ color: TENSION_COLORS.timePerspective.longTerm, transparent: true, opacity: 0.4 }),
    // Back Face (-Z): Immediate (Red)
    new THREE.MeshBasicMaterial({ color: TENSION_COLORS.timePerspective.immediate, transparent: true, opacity: 0.4 }),
  ];

  return (
    <group>
      {/* Cube */}
      <mesh material={materials}>
        <boxGeometry args={[2, 2, 2]} />
      </mesh>
      {/* Axes */}
      {/* X-Axis: Autonomy */}
      <Axis
        start={[-1.2, 0, 0]}
        end={[1.2, 0, 0]}
        colorStart={TENSION_COLORS.autonomy.userChoice}
        colorEnd={TENSION_COLORS.autonomy.aiGuidance}
        label="Autonomy"
      />
      {/* Y-Axis: Beneficiary */}
      <Axis
        start={[0, -1.2, 0]}
        end={[0, 1.2, 0]}
        colorStart={TENSION_COLORS.beneficiary.individual}
        colorEnd={TENSION_COLORS.beneficiary.collective}
        label="Beneficiary"
      />
      {/* Z-Axis: Time Perspective */}
      <Axis
        start={[0, 0, -1.2]}
        end={[0, 0, 1.2]}
        colorStart={TENSION_COLORS.timePerspective.immediate}
        colorEnd={TENSION_COLORS.timePerspective.longTerm}
        label="Time Perspective"
      />
      {/* Cube Points */}
      {points.map((point, index) => (
        <CubePoint
          key={index}
          position={point.position}
          label={point.label}
          risks={point.risks}
          benefits={point.benefits}
        />
      ))}
    </group>
  );
}

function TensionsInfo() {
  return (
    <div className="tensions-info">
      <h2>Three Tensions</h2>
      <div className="tension tension-time">
        <span
          className="tension-label"
          style={{ color: TENSION_COLORS.timePerspective.immediate }}
        >
          Immediate
        </span>
        {' vs. '}
        <span
          className="tension-label"
          style={{ color: TENSION_COLORS.timePerspective.longTerm }}
        >
          Long-Term Well-Being
        </span>
        <p>Represents whether the AI prioritizes short-term or long-term well-being.</p>
      </div>
      <div className="tension tension-beneficiary">
        <span
          className="tension-label"
          style={{ color: TENSION_COLORS.beneficiary.individual }}
        >
          Individual
        </span>
        {' vs. '}
        <span
          className="tension-label"
          style={{ color: TENSION_COLORS.beneficiary.collective }}
        >
          Collective Well-Being
        </span>
        <p>Represents the balance between individual and societal benefits.</p>
      </div>
      <div className="tension tension-autonomy">
        <span
          className="tension-label"
          style={{ color: TENSION_COLORS.autonomy.userChoice }}
        >
          User Choice
        </span>
        {' vs. '}
        <span
          className="tension-label"
          style={{ color: TENSION_COLORS.autonomy.aiGuidance }}
        >
          AI Guidance
        </span>
        <p>Represents whether the user has autonomy or the AI provides guidance.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <TensionsInfo />
      <Canvas camera={{ position: [4, 4, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} />
        <Cube />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
