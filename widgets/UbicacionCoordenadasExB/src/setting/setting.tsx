/* eslint-disable @typescript-eslint/naming-convention */
import { React } from 'jimu-core'
import { type AllWidgetSettingProps } from 'jimu-for-builder'
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'
import { Button, AdvancedSelect, Option, TextInput } from 'jimu-ui'
import { SettingSection, MapWidgetSelector, JimuLayerViewSelectorDropdown } from 'jimu-ui/advanced/setting-components'
import { type IMConfig } from '../config'
import { useState } from 'react'

const Setting = (props: AllWidgetSettingProps<IMConfig>) => {
  const __tituloCapaDestino = props.config.featureLayerDestino.titulo
  let __campoFecha = props.config.featureLayerDestino.camposCalculados.campoFecha
  let __campoLatitud = props.config.featureLayerDestino.camposCalculados.campoLatitud
  let __campoLongitud = props.config.featureLayerDestino.camposCalculados.campoLongitud
  let __intersecciones = props.config.featureLayerDestino.intersecciones

  console.log('props.config')
  console.log(props.config)

  // let __tituloCapaDestino = null
  let pointFeatureLayers = []
  let polygonFeatureLayers = []
  let __interseccion = null

  let map = null
  const [capasDestinoSelectValue, setcapasDestinoValue] = useState('')
  const [mapViewId, setMapViewId] = useState('')
  const [capasDestinoSelectOptions, setCapasDestinoSelectOptions] = useState([])

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
          console.log(layerViews[key].id)
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

    setCapasDestinoSelectOptions(pointFeatureLayers)
    __capaDestinoSelect.props.children = capasDestinoSelectOptions.map(op => {
      console.log(op)
      return (
        <Option value= {op.value} key={op.value}>
          {op.label}
        </Option>
      )
    })

    console.log(pointLayerOptions)
    console.log(polygonLayerOptions)

    console.log('__capaDestinoSelect')
    console.log(__capaDestinoSelect)

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
    __interseccionesSelect.props.options = interseccionesOptions
    if (__interseccion !== undefined) {
      __interseccionesSelect.props.value = __interseccion.nombre
      __nombreInterseccionTextArea.props.value = __interseccion.nombre
    }
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
    __nombreInterseccionTextArea.props.value = value
    __interseccion = __intersecciones.find(item => {
      return item.nombre === value
    })
    if (__interseccion !== undefined) {
      __capaOrigenSelect.props.enabled = true
      __campoFuenteSelect.props.enabled = true
      __campoDestinoSelect.props.enabled = true
      __capaOrigenSelect.props.value = __interseccion.tituloCapaFuente
      __campoDestinoSelect.props.value = __interseccion.campoDestino
    }
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
      __campoFuenteSelect.props.value = __interseccion.campoFuente
    }
  }

  const _setCamposFuente = (featureLayer) => {
    console.log('_setCamposFuente')
    const options = _getFieldNamesByType(featureLayer, 'esriFieldTypeString')
    __campoFuenteSelect.props.optiones = options
  }

  const _setCamposFecha = (featureLayer) => {
    console.log('_setCamposFecha')
    const options = _getFieldNamesByType(featureLayer, 'esriFieldTypeDate')
    __campoFechaSelect.props.options = options
    __campoFechaSelect.props.value = __campoFecha
  }

  const _setCamposLatitud = (featureLayer) => {
    console.log('_setCamposLatitud')
    const options = _getFieldNamesByType(featureLayer, 'esriFieldTypeString')
    __campoLatitudSelect.props.options = options
    __campoLatitudSelect.props.value = __campoLatitud
  }

  const _setCamposLongitud = (featureLayer) => {
    console.log('_setCamposLongitud')
    const options = _getFieldNamesByType(featureLayer, 'esriFieldTypeString')
    __campoLongitudSelect.props.options = options
    __campoLongitudSelect.props.value = __campoLongitud
  }

  const _setCamposDestino = (featureLayer) => {
    console.log('_setCamposDestino')
    const options = _getFieldNamesByType(featureLayer, 'esriFieldTypeString')
    __campoDestinoSelect.props.options = options
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
    const newLength = __intersecciones.length + 1
    __intersecciones.push({
      nombre: 'Intersección #' + newLength,
      campoDestino: '',
      tituloCapaFuente: '',
      campoFuente: ''
    })
    __interseccion = __intersecciones[newLength - 1]
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

  const __capaDestinoSelect = <AdvancedSelect
    aria-required={true}
    style={{ width: '100%' }}
    onChange={_setCapaDestino} />

  const __campoFechaSelect = <AdvancedSelect
    aria-required={true}
    style={{ width: '100%' }}
    onChange={_setCampoFecha} />

  const __campoLatitudSelect = <AdvancedSelect
    aria-required={true}
    style={{ width: '100%' }}
    onChange={_setCampoLatitud} />

  const __campoLongitudSelect = <AdvancedSelect
    aria-required={true}
    style={{ width: '100%' }}
    onChange={_setCampoLongitud} />

  const __interseccionesSelect = <AdvancedSelect
    aria-required={true}
    style={{ width: '100%' }}
    onChange={_setInterseccion} />

  const __nombreInterseccionTextArea = <TextInput id="nombreInterseccionTextArea"
    aria-required={true}
    disabled = { false }
    style={{ width: '100%' }}
    onChange={_setNombreInterseccion} />

  const __capaOrigenSelect = <AdvancedSelect
    aria-required={true}
    style={{ width: '100%' }}
    onChange={_setCapaOrigen} />

  const __campoFuenteSelect = <AdvancedSelect
    aria-required={true}
    style={{ width: '100%' }}
    onChange={_setCampoFuente} />

  const __campoDestinoSelect = <AdvancedSelect
    aria-required={true}
    style={{ width: '100%' }}
    onChange={_setCampoDestino} />

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
            <JimuLayerViewSelectorDropdown
                isMultiSelection={false}
                jimuMapViewId={mapViewId}
                defaultSelectedValues={[capasDestinoSelectValue]}
                onChange={(s) => { _setCapaDestino(s) }}/>
            </td>
          </tr>
          {/* <tr>
            <td className="etiqueta">
              <label htmlFor="campoFechaSelect">Campo Fecha:</label>
            </td>
            <td className="lista">
              {__campoFechaSelect}
            </td>
          </tr>
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
