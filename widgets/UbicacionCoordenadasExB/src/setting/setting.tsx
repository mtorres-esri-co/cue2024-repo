/* eslint-disable @typescript-eslint/naming-convention */
import { Immutable, React, JimuFieldType, DataSourceTypes, getAppStore, appActions, DataSource, DataSourceComponent, DataSourceManager } from 'jimu-core'
import { type AllWidgetSettingProps } from 'jimu-for-builder'
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'
import { Button } from 'jimu-ui'
import { SettingSection, MapWidgetSelector, JimuLayerViewSelectorDropdown } from 'jimu-ui/advanced/setting-components'
import { FieldSelector } from 'jimu-ui/advanced/data-source-selector'
import { type IMConfig } from '../config'
import { useState, useEffect, useRef } from 'react'

const Setting = (props: AllWidgetSettingProps<IMConfig>) => {
  const __tituloCapaDestino = props.config.featureLayerDestino.titulo
  let __campoFecha = props.config.featureLayerDestino.camposCalculados.campoFecha
  let __campoLatitud = props.config.featureLayerDestino.camposCalculados.campoLatitud
  let __campoLongitud = props.config.featureLayerDestino.camposCalculados.campoLongitud
  const __intersecciones = props.config.featureLayerDestino.intersecciones

  console.log('props.config')
  console.log(props.config)

  // let __tituloCapaDestino = null
  let pointFeatureLayers = []
  let polygonFeatureLayers = []
  let __interseccion = null

  let map = null
  const [mapViewId, setMapViewId] = useState('')
  const [capasDestinoSelectValue, setcapasDestinoValue] = useState('')
  const [intersecciones, setIntersecciones] = useState([])

  const allDsIds = useRef<string[]>([])
  console.log('allDsIds')
  console.log(allDsIds)

  console.log('props.useDataSources')
  console.log(props.useDataSources)

  const onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    props.onSettingChange({
      id: props.id,
      useMapWidgetIds: useMapWidgetIds
    })
  }

  const onActiveViewChanged = (jmv: JimuMapView) => {
    setMapViewId(jmv.id)
    console.log(jmv)

    if (jmv) {
      map = jmv.view.map
      const layerViews = jmv.jimuLayerViews

      for (const key in layerViews) {
        if (layerViews[key].id === __tituloCapaDestino || layerViews[key].layer.title === __tituloCapaDestino) {
          setcapasDestinoValue(layerViews[key].id)
          console.log(__tituloCapaDestino)
        }
      }
    } else {
      map = undefined
    }
    console.log('map')
    console.log(map)
    fillLayerList()
    setValues()
  }

  const fillLayerList = () => {
    console.log('fillLayerList')
    console.log(map)
    if (map !== undefined) {
      pointFeatureLayers = map.layers.filter(layer => {
        return layer.type === 'feature' && layer.geometryType === 'point'
      })
      polygonFeatureLayers = map.layers.filter(layer => {
        return layer.type === 'feature' && layer.geometryType === 'polygon'
      })
    }
    console.log('pointFeatureLayers')
    console.log(pointFeatureLayers.length)
    console.log('polygonFeatureLayers')
    console.log(polygonFeatureLayers.length)
  }

  const setValues = () => {
    console.log('setValues')
    const pointLayerOptions = []
    const polygonLayerOptions = []

    pointFeatureLayers.forEach(layer => {
      pointLayerOptions.push({ label: layer.title, value: layer.title })
    })
    polygonFeatureLayers.forEach(layer => {
      polygonLayerOptions.push({ label: layer.title, value: layer.title })
    })

    console.log(pointLayerOptions)
    console.log(polygonLayerOptions)

    if (__intersecciones.length > 0) {
      __interseccion = __intersecciones[0]
      _setIntersecciones()
    }
  }

  const _setIntersecciones = () => {
    console.log('_setIntersecciones')
    const interseccionesOptions = []
    __intersecciones.forEach(item => {
      interseccionesOptions.push({ value: item.nombre, label: item.nombre })
    })
  }

  const _setCapaDestino = (value: any) => {
    console.log('_setCapaDestino')
    console.log(value)
    const featureLayer = pointFeatureLayers.find(layer => {
      return layer.title === value
    })
    if (featureLayer !== undefined) {
      _setCamposFecha(featureLayer)
      _setCamposLatitud(featureLayer)
      _setCamposLongitud(featureLayer)
      _setCamposDestino(featureLayer)
    }
  }

  const _setInterseccion = (value: any) => {
    console.log('_setInterseccion(' + value + ')')
    __interseccion = __intersecciones.find(item => {
      return item.nombre === value
    })
  }

  const _setCapaOrigen = (value: any) => {
    console.log('_setCapaOrigen(' + value + ')')
    const featureLayer = polygonFeatureLayers.find(layer => {
      return layer.title === value
    })
    if (featureLayer !== undefined) {
      _setCamposFuente(featureLayer)
    }
    if (__interseccion !== undefined) {
      __interseccion.tituloCapaFuente = value
    }
  }

  const _setCamposFuente = (featureLayer) => {
    console.log('_setCamposFuente')
    const options = _getFieldNamesByType(featureLayer, 'esriFieldTypeString')
  }

  const _setCamposFecha = (featureLayer) => {
    console.log('_setCamposFecha')
  }

  const _setCamposLatitud = (featureLayer) => {
    console.log('_setCamposLatitud')
  }

  const _setCamposLongitud = (featureLayer) => {
    console.log('_setCamposLongitud')
  }

  const _setCamposDestino = (featureLayer) => {
    console.log('_setCamposDestino')
  }

  const _setCampoFuente = (value) => {
    console.log('_setCampoFuente(' + value + ')')
    if (__interseccion !== undefined) {
      __interseccion.campoFuente = value
    }
  }

  const _setCampoDestino = (value) => {
    console.log('_setCampoDestino(' + value + ')')
    if (__interseccion !== undefined) {
      __interseccion.campoDestino = value
    }
  }

  const _setCampoFecha = (value) => {
    console.log('_setCampoFecha(' + value + ')')
    __campoFecha = value
  }

  const _setCampoLatitud = (value) => {
    console.log('_setCampoLatitud(' + value + ')')
    __campoLatitud = value
  }

  const _setCampoLongitud = (value) => {
    console.log('_setCampoLongitud(' + value + ')')
    __campoLongitud = value
  }

  const _setNombreInterseccion = (value) => {
    console.log('_setNombreInterseccion')
    if (__interseccion !== undefined) {
      __interseccion.nombre = value
      _setIntersecciones()
    }
  }

  const _getFieldNamesByType = (featureLayer, type: string) => {
    console.log('_getFieldNamesByType')
    const fieldList = []
    featureLayer.popupInfo.fieldInfos.forEach(fi => {
      if (fi.visible) {
        const field = featureLayer.resourceInfo.fields.find(f => {
          return f.name === fi.fieldName
        })
        if (field !== undefined) {
          if (field.type === type) {
            fieldList.push({ label: fi.label, value: field.name })
          }
        }
      }
    })
    return fieldList
  }

  const _addInterseccion = () => {
    console.log('_addInterseccion')
    const _intersecciones = intersecciones

    const newLength = intersecciones.length + 1
    _intersecciones.push({
      nombre: 'Intersección #' + newLength,
      campoDestino: '',
      tituloCapaFuente: '',
      campoFuente: ''
    })
    __interseccion = _intersecciones[newLength - 1]
    setIntersecciones(_intersecciones)
    _setIntersecciones()
  }

  const _deleteInterseccion = () => {
    console.log('_deleteInterseccion')
    if (__interseccion !== undefined) {
      const index = __intersecciones.indexOf(__interseccion)
      __intersecciones.slice(index, 1)
      __interseccion = __intersecciones[index === 0 ? 0 : index - 1]
      _setIntersecciones()
    }
  }

  const _capasDestinoHideLayers = (layer, layers) => {
    console.log('_capasDestinoHideLayers')
    console.log(layer)
    console.log(layers)
    return false
  }

  const __capaDestinoLayerViewSelector = <JimuLayerViewSelectorDropdown
      isMultiSelection={false}
      jimuMapViewId={mapViewId}
      defaultSelectedValues={[capasDestinoSelectValue]}
      hideLayers={_capasDestinoHideLayers}
      onChange={(s) => { _setCapaDestino(s) }}
    />

  const __campoFechaFieldSelect = <FieldSelector
      isMultiple = {false}
      useDropdown = {true}
      types = {Immutable([JimuFieldType.Date])}
    />

  const __addInterseccionButton = <Button id = "addInterseccionButton"
    className="jimu-btn"
    onClick={_addInterseccion}>Agregar</Button>

  const __deleteInterseccionButton = <Button id = "addInterseccionButton"
    className="jimu-btn"
    onClick={_deleteInterseccion}>Eliminar</Button>

  return (
    <div>
      <div className="jimu-widget jimu-widget-ubicacioncoordenadas-setting" id="mainDiv">
        {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
          <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={onActiveViewChanged} />
        )}
        <SettingSection title="Mapa">
          <MapWidgetSelector
              useMapWidgetIds={props.useMapWidgetIds}
              onSelect={onMapWidgetSelected}
          />
        </SettingSection>
        <SettingSection title="Capa Destino">
        <br />
        <table style={{ width: '100%' }}>
          <tr>
            <td className="etiqueta">
              <label htmlFor="capaDestinoSelect">Capa:</label>
            </td>
            <td className="lista">
              {__capaDestinoLayerViewSelector}
            </td>
          </tr>
          <tr>
            <td className="etiqueta">
              <label htmlFor="campoFechaSelect">Campo Fecha:</label>
            </td>
            <td className="lista">
              {__campoFechaFieldSelect}
            </td>
          </tr>
          {/*
          <tr>
            <td className="etiqueta">
              <label htmlFor="campoLatitudSelect">Campo Latitud:</label>
            </td>
            <td className="lista">
              {__campoLatitudSelect}
            </td>
          </tr>
          <tr>
            <td className="etiqueta">
              <label htmlFor="campoLongitudSelect">Campo Longitud:</label>
            </td>
            <td className="lista">
              {__campoLongitudSelect}
            </td>
          </tr>
          <tr>
            <td colSpan={2} className="encabezado">
              Intersecciones
            </td>
          </tr>
          <tr>
            <td className="etiqueta">
              <label htmlFor="interseccionesSelect">Intersección:</label>
            </td>
            <td className="lista">
              {__interseccionesSelect}
            </td>
          </tr>
          <tr>
            <td className="etiqueta">
              <label htmlFor="nombreInterseccionTextArea">Nombre:</label>
            </td>
            <td className="lista">
              {__nombreInterseccionTextArea}
            </td>
          </tr>
          <tr>
            <td className="etiqueta">
              <label htmlFor="campoDestinoSelect">Campo Destino:</label>
            </td>
            <td className="lista">
              {__campoDestinoSelect}
            </td>
          </tr>
          <tr>
            <td className="etiqueta">
              <label htmlFor="capaOrigenSelect">Capa Origen:</label>
            </td>
            <td className="lista">
              {__capaOrigenSelect}
            </td>
          </tr>
          <tr>
            <td className="etiqueta">
              <label htmlFor="campoFuenteSelect">Campo Origen:</label>
            </td>
            <td className="lista">
              {__campoFuenteSelect}
            </td>
          </tr> */}
          <tr>
            <td colSpan={2}>
              {__addInterseccionButton}
              <span>  </span>
              {__deleteInterseccionButton}
            </td>
          </tr>
        </table>
        </SettingSection>
      </div>
    </div>
  )
}

export default Setting
