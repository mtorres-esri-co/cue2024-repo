import { type ImmutableObject } from 'seamless-immutable'

export interface CamposCalculados {
  campoFecha: string
  campoLatitud: string
  campoLongitud: string
}

export interface FeatureLayerDestino {
  titulo: string
  camposCalculados: CamposCalculados
  intersecciones: Interseccion[]
}

export interface Interseccion {
  nombre: string
  campoDestino: string
  tituloCapaFuente: string
  campoFuente: string
}

export interface Config {
  featureLayerDestino: FeatureLayerDestino
  exampleConfigProperty: string
}

export type IMConfig = ImmutableObject<Config>
