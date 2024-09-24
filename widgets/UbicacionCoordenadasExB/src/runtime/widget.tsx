/* eslint-disable @typescript-eslint/naming-convention */
import { React, type AllWidgetProps } from 'jimu-core'
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'
import { NumericInput, Select, Button, Checkbox, Label, TextInput, Option } from 'jimu-ui'
import { type IMConfig } from '../config'
import { useState, useRef } from 'react'
import Point from '@arcgis/core/geometry/Point'
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'
import Color from '@arcgis/core/Color'
import Graphic from '@arcgis/core/Graphic'
import { DatePicker } from 'jimu-ui/basic/date-picker'

const Widget = (props: AllWidgetProps<IMConfig>) => {
  const __tituloCapaDestino = props.config.featureLayerDestino.titulo
  const __campoFecha = props.config.featureLayerDestino.camposCalculados.campoFecha
  const __campoLatitud = props.config.featureLayerDestino.camposCalculados.campoLatitud
  const __campoLongitud = props.config.featureLayerDestino.camposCalculados.campoLongitud
  const __intersecciones = props.config.featureLayerDestino.intersecciones

  const [locateButtonDisabled, setLocateButtonDisabled] = useState(false)
  const [addButtonDisabled, setAddButtonDisabled] = useState(true)
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true)
  const [dismissButtonDisabled, setDismissButtonDisabled] = useState(true)
  const [formatCheckBoxChecked, setFormatCheckBoxChecked] = useState(false)
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>()
  const [latDegrees, setLatDegrees] = useState(4)
  const [latMinutes, setLatMinutes] = useState(0)
  const [latSeconds, setLatSeconds] = useState(0)
  const [latQuadrante, setLatQuadrante] = useState('N')
  const [lonDegrees, setLonDegrees] = useState(74)
  const [lonMinutes, setLonMinutes] = useState(0)
  const [lonSeconds, setLonSeconds] = useState(0)
  const [lonQuadrante, setLonQuadrante] = useState('W')
  const [latDecimalDegrees, setLatDecimalDegrees] = useState(4)
  const [lonDecimalDegrees, setLonDecimalDegrees] = useState(-74)
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [fechaConsulta, setFechaConsulta] = useState(new Date())
  const [valoresInterseccion, setValoresInterseccion] = useState([{ campoDestino: '', valor: '' }])
  const [valorInterseccion, setValorInterseccion] = useState('')
  const [labelCampoFecha, setLabelCampoFecha] = useState('')
  const [labelCampoLatitud, setLabelCampoLatitud] = useState('')
  const [labelCampoLongitud, setLabelCampoLongitud] = useState('')
  const [labelCampoDestino, setLabelCampoDestino] = useState('')
  const [featureLayerDestino, setFeatureLayerDestino] = useState(null)

  const _decimalDegreesDiv = useRef(null)
  const _dMSDiv = useRef(null)
  const _messageDiv = useRef(null)
  const _resultsContentDiv = useRef(null)

  // const _createFeatureForm = async () => {}
  const _fillHeight = () => {
    console.log('_fillHeight')
    console.log(props)
    const widgetDom = document.getElementById(props.id)
    console.log(widgetDom)

    const panelDom = document.getElementById('widget-ubicacion-coordenadas')
    const panelInfo = panelDom.getBoundingClientRect()
    const contentInfo = _resultsContentDiv.current.getBoundingClientRect()
    const hcc = panelInfo.height + panelInfo.top - contentInfo.top - 20
    _resultsContentDiv.current.style.height = hcc + 'px'
  }

  /* Handlers */
  const _jimuMapViewActiveViewChange = (jmv: JimuMapView) => {
    console.log('_jimuMapViewActiveViewChange')
    console.log(jmv)

    if (jmv) {
      setJimuMapView(jmv)
      const layerViews = jmv.jimuLayerViews
      console.log('layerViews')
      console.log(layerViews)
      for (const key in layerViews) {
        console.log(key)
        console.log(layerViews[key].id)
        console.log(layerViews[key].layer.title)

        if (layerViews[key].layer.title === __tituloCapaDestino) {
          setFeatureLayerDestino(layerViews[key].layer)
          layerViews[key].layer.fields.forEach(field => {
            console.log(field.name + ' - ' + field.alias)
            if (field.name.toLowerCase() === __campoFecha.toLowerCase()) {
              setLabelCampoFecha(field.alias)
            } else if (field.name.toLowerCase() === __campoLatitud.toLowerCase()) {
              setLabelCampoLatitud(field.alias)
            } else if (field.name.toLowerCase() === __campoLongitud.toLowerCase()) {
              setLabelCampoLongitud(field.alias)
            } else {
              __intersecciones.forEach(item => {
                if (field.name.toLowerCase() === item.campoDestino.toLowerCase()) {
                  setLabelCampoDestino(field.alias)
                }
              })
            }
          })
        }
      }
    }
  }

  const _formatTypeCheckBoxOnChange = (evt, checked: boolean) => {
    console.log('_formatTypeCheckBoxOnChange(' + checked + ')')
    if (_decimalDegreesDiv.current) {
      _decimalDegreesDiv.current.style.display = checked ? 'block' : 'none'
    }
    if (_dMSDiv.current) {
      _dMSDiv.current.style.display = checked ? 'none' : 'block'
    }
    setFormatCheckBoxChecked(checked)
  }

  const _locateCoordinates = async () => {
    const normal = true
    let x
    let y
    if (normal) {
      if (!formatCheckBoxChecked) {
        console.log('Grados Minutos Segundos')
        const yd = latDegrees !== undefined ? latDegrees : _latDegreesNumericInput.props.defaultValue
        const ym = latMinutes !== undefined ? latMinutes : _latMinutesNumericInput.props.defaultValue
        const ys = latSeconds !== undefined ? latSeconds : _latSecondsNumericInput.props.defaultValue
        const yq = latQuadrante !== undefined ? latQuadrante : _latQuadranteSelect.props.defaultValue

        const xd = lonDegrees !== undefined ? lonDegrees : _lonDegreesNumericInput.props.defaultValue
        const xm = lonMinutes !== undefined ? lonMinutes : _lonMinutesNumericInput.props.defaultValue
        const xs = lonSeconds !== undefined ? lonSeconds : _lonSecondsNumericInput.props.defaultValue
        const xq = lonQuadrante !== undefined ? lonQuadrante : _lonQuadranteSelect.props.defaultValue

        x = (xd + xm / 60 + xs / 3600) * (xq === 'E' ? 1.0 : -1.0)
        y = (yd + ym / 60 + ys / 3600) * (yq === 'N' ? 1.0 : -1.0)
        setLongitude(x)
        setLatitude(y)
        console.log('lat:' + y + ', lon:' + x)
      } else {
        console.log('Grados Decimales')
        x = lonDecimalDegrees !== undefined ? lonDecimalDegrees : _lonDecimalDegreesLatitudeNumericInput.props.defaultValue
        y = latDecimalDegrees !== undefined ? latDecimalDegrees : _latDecimalDegreesLatitudeNumericInput.props.defaultValue
        setLongitude(x)
        setLatitude(y)
        console.log('lat:' + y + ', lon:' + x)
      }
      const point = new Point({ x: x, y: y })
      const outlineSymbol = new SimpleLineSymbol()
      outlineSymbol.width = 2
      outlineSymbol.color = new Color([0, 115, 76, 1])

      const markerSymbol = new SimpleMarkerSymbol()
      markerSymbol.color = new Color([0, 255, 197, 0.50])
      markerSymbol.outline = outlineSymbol

      const graphic = new Graphic({
        geometry: point,
        symbol: markerSymbol
      })

      jimuMapView.view.graphics.removeAll()
      jimuMapView.view.graphics.add(graphic)
      jimuMapView.view.center = point
      jimuMapView.view.zoom = 12

      console.log('Coordenadas válidas')
      const _valoresInterseccion = []
      __intersecciones.forEach(async item => {
        const valor = await _getIntersectedFeatureValue(item.tituloCapaFuente, point, item.campoFuente)
        console.log('Valor de intersección: ' + valor)
        _valoresInterseccion.push({ campoDestino: item.campoDestino, valor: valor })
        setValorInterseccion(valor)
        setValoresInterseccion(_valoresInterseccion)
        console.log(item.campoDestino + " = '" + valor + "'")
        console.log(_valoresInterseccion)
        console.log(valoresInterseccion)
        console.log(_valoresInterseccion[0].valor)
        console.log(valoresInterseccion[0].valor)
      })

      setAddButtonDisabled(false)
      setDismissButtonDisabled(false)
      setLocateButtonDisabled(true)
    } else {
      console.log('Coordenadas inválidas')
      _messageDiv.current.innerHTML = 'Coordenadas inválidas'
    }
  }

  const _getIntersectedFeatureValue = async (tituloCapaFuente: string, point: Point, campoFuente: string) => {
    let fieldValue = ''
    let featureLayerView = null

    for (const key in jimuMapView.jimuLayerViews) {
      if (jimuMapView.jimuLayerViews[key].id === __tituloCapaDestino || jimuMapView.jimuLayerViews[key].layer.title === tituloCapaFuente) {
        featureLayerView = jimuMapView.jimuLayerViews[key]
        console.log(jimuMapView.jimuLayerViews[key].layer.title + ' - ' + tituloCapaFuente)
        console.log(jimuMapView.jimuLayerViews[key].id)
      }
    }

    if (featureLayerView !== null) {
      const intersectionQuery = featureLayerView.layer.createQuery()
      intersectionQuery.geometry = point
      intersectionQuery.outFields = [campoFuente]
      intersectionQuery.returnGeometry = false

      const results = await featureLayerView.layer.queryFeatures(intersectionQuery)
      console.log('Intersected features: ')
      console.log(results)
      if (results.features.length > 0) {
        fieldValue = results.features[0].attributes[campoFuente]
      }
    }
    return fieldValue
  }

  const _addCoordsLocation = () => {
    _fillHeight()
    setAddButtonDisabled(true)
    setSaveButtonDisabled(false)
    console.log(_resultsContentDiv.current.style.display)
    _resultsContentDiv.current.style.display = 'block'
  }

  const _dismissLocation = () => {
    _messageDiv.current.innerHTML = '<br />'
    _resultsContentDiv.current.style.display = 'none'
    jimuMapView.view.graphics.removeAll()
    setLocateButtonDisabled(false)
    setAddButtonDisabled(true)
    setSaveButtonDisabled(true)
    setDismissButtonDisabled(true)
  }

  const _saveCoordsLocation = async () => {
    console.log('_saveCoordsLocation')
    if (featureLayerDestino !== null) {
      const attributes = {}

      featureLayerDestino.fields.forEach(fi => {
        console.log('fi.name')
        console.log(fi.name)
        const xx = valoresInterseccion.find(item => fi.name === item.campoDestino)
        console.log('campoDestino')
        console.log(xx)
        if (fi.name.toLowerCase() === __campoFecha.toLowerCase()) {
          attributes[fi.name] = fechaConsulta.getTime()
        } else if (fi.name.toLowerCase() === __campoLatitud.toLowerCase()) {
          attributes[fi.name] = latitude
        } else if (fi.name.toLowerCase() === __campoLongitud.toLowerCase()) {
          attributes[fi.name] = longitude
        } else if (fi.name.toLowerCase() === valoresInterseccion[0].campoDestino.toLowerCase()) {
          attributes[fi.name] = valorInterseccion
        }
        console.log(fi.name + ' = ' + attributes[fi.name])
      })
      console.log('attributes')
      console.log(attributes)

      const graphic = new Graphic({ geometry: new Point({ x: longitude, y: latitude }), attributes: attributes })
      const adds = [graphic]
      const results = await featureLayerDestino.applyEdits({ addFeatures: adds })
      console.log('results')
      console.log(results)

      if (results.addFeatureResults.length > 0 && results.addFeatureResults[0].error === null) {
        _messageDiv.current.innerHTML = '<span style="font-weight:bolder">Elemento agregado. OBJECTID = ' + results.addFeatureResults[0].objectId + '.</span>'
      } else {
        _messageDiv.current.innerHTML = '<span style="color:red;font-weight:bolder">No se pudo agregar elemento: ' + results.addFeatureResults[0].error + '.</span>'
      }

      jimuMapView.view.graphics.removeAll()
    }
    setAddButtonDisabled(true)
    setSaveButtonDisabled(true)
    setLocateButtonDisabled(false)
    setDismissButtonDisabled(true)
    _resultsContentDiv.current.style.display = 'none'
  }

  const __formatTypeCheckBox = <Label>
    <Checkbox
      checked={formatCheckBoxChecked}
      onChange={(evt, checked) => { _formatTypeCheckBoxOnChange(evt, checked) }} />
      <span> </span>
      Grados decimales
  </Label>

  const _latDegreesNumericInput = <NumericInput
    defaultValue={4}
    step={1}
    min={0}
    max={90}
    precision={0}
    value={latDegrees}
    onChange={(value) => { setLatDegrees(value) }}
    style={ { width: '65px', textAlign: 'right' }}/>

  const _latMinutesNumericInput = <NumericInput
    defaultValue={0}
    step={1}
    min={0}
    max={59}
    precision={0}
    value={latMinutes}
    onChange={(value) => { setLatMinutes(value) }}
    style={ { width: '65px', textAlign: 'right' }}/>

  const _latSecondsNumericInput = <NumericInput
    defaultValue={0}
    step={0.01}
    min={0}
    max={59.99}
    precision={2}
    value={latSeconds}
    onChange={(value) => { setLatSeconds(value) }}
    style={ { width: '70px', textAlign: 'right' }}/>

  const _lonDegreesNumericInput = <NumericInput
    defaultValue={74}
    step={1}
    min={0}
    max={90}
    precision={0}
    value={lonDegrees}
    onChange={(value) => { setLonDegrees(value) }}
    style={ { width: '65px', textAlign: 'right' }}
  />

  const _lonMinutesNumericInput = <NumericInput
    defaultValue={0}
    step={1}
    min={0}
    max={59}
    value={lonMinutes}
    onChange={(value) => { setLonMinutes(value) }}
    style={ { width: '65px', textAlign: 'right' }}
  />

  const _lonSecondsNumericInput = <NumericInput
    defaultValue={0}
    step={0.01}
    min={0}
    max={59.99}
    precision={2}
    value={lonSeconds}
    onChange={(value) => { setLonSeconds(value) }}
    style={ { width: '70px', textAlign: 'right' }}
  />

  const _latDecimalDegreesLatitudeNumericInput = <NumericInput
    showHandlers={false}
    step={0.0001}
    precision={10}
    value={latDecimalDegrees}
    onChange={ (value) => { setLatDecimalDegrees(value) }}
    defaultValue={4}
    style={ { textAlign: 'right' }}
  />

  const _lonDecimalDegreesLatitudeNumericInput = <NumericInput
    showHandlers={false}
    step={0.0001}
    precision={10}
    value={lonDecimalDegrees}
    onChange={ (value) => { setLonDecimalDegrees(value) }}
    defaultValue={-74}
    style={ { textAlign: 'right' }}
  />

  const _latQuadranteSelect = <Select
      aria-required={true}
      style={{ width: '45px' }}
      defaultValue={'N'}
      value={latQuadrante}
      onChange={(evt, item) => { setLatQuadrante(item.props.value) }}
    >
    <Option value="N">N</Option>
    <Option value='S'>S</Option>
  </Select>

  const _lonQuadranteSelect = <Select
      aria-required={true}
      style={{ width: '45px' }}
      defaultValue={'W'}
      value={lonQuadrante}
      onChange={(evt, item) => { setLonQuadrante(item.props.value) }}
    >
    <Option value="E">E</Option>
    <Option value="W">W</Option>
  </Select>

  const __locateButton = <Button
    className="jimu-btn"
    disabled={locateButtonDisabled}
    style={{ width: '65px', padding: '4px 4px' }}
    onClick={_locateCoordinates}>Ubicar</Button>

  const __addButton = <Button
    className="jimu-btn"
    disabled={addButtonDisabled}
    style={{ width: '70px', padding: '4px 4px' }}
    onClick={_addCoordsLocation}>Agregar</Button>

  const __saveButton = <Button
    className="jimu-btn"
    disabled={saveButtonDisabled}
    style={{ width: '70px', padding: '4px 4px' }}
    onClick={_saveCoordsLocation}>Guardar</Button>

  const __dismissButton = <Button
    className="jimu-btn"
    disabled={dismissButtonDisabled}
    style={{ width: '75px', padding: '4px 4px' }}
    onClick={_dismissLocation}>Descartar</Button>

  return (
    <div id='widget-ubicacion-coordenadas' className='widget-ubicacion-coordenadas jimu-widget'>
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={_jimuMapViewActiveViewChange} />
      )}
      <div id="mainDiv" className="mainDiv">
        <table style={{ width: '100%' }}>
          <tr>
            <td>
              <div>
                {__formatTypeCheckBox}
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div id="inputDiv" className="panelDiv">
                <div ref={_decimalDegreesDiv} style={{ display: 'none' }} >
                  <div>
                    <table>
                      <tr>
                        <td colSpan={2}>
                          <label>Latitud:</label>
                        </td>
                      </tr>
                      <tr>
                        <td>{_latDecimalDegreesLatitudeNumericInput}</td>
                      </tr>
                      <tr>
                        <td colSpan={2}>
                          <label>Longitud:</label>
                        </td>
                      </tr>
                      <tr>
                        <td>{_lonDecimalDegreesLatitudeNumericInput}</td>
                      </tr>
                    </table>
                  </div>
                </div>
                <div ref={_dMSDiv} >
                  <div id="latitudeDiv">
                    <table>
                      <tr>
                        <td colSpan={4}>
                          <label>Latitud:</label>
                        </td>
                      </tr>
                      <tr>
                        <td>{_latDegreesNumericInput}</td>
                        <td><label>°</label></td>
                        <td>{_latMinutesNumericInput}</td>
                        <td><label>'</label></td>
                        <td>{_latSecondsNumericInput} </td>
                        <td><label>"</label></td>
                        <td>{_latQuadranteSelect}</td>
                      </tr>
                    </table>
                  </div>
                  <div id="LongitudeDiv" className="active">
                    <table>
                      <tr>
                        <td colSpan={4}>
                          <label>Longitud: </label>
                        </td>
                      </tr>
                      <tr>
                        <td>{_lonDegreesNumericInput}</td>
                        <td><label>°</label></td>
                        <td>{_lonMinutesNumericInput}</td>
                        <td><label>'</label></td>
                        <td>{_lonSecondsNumericInput} </td>
                        <td><label>"</label></td>
                        <td>{_lonQuadranteSelect}</td>
                      </tr>
                    </table>
                  </div>
                </div>
                <br />
                <div>
                  <table>
                    <tr>
                      <td>{__locateButton}</td>
                      <td>{__addButton}</td>
                      <td>{__saveButton}</td>
                      <td>{__dismissButton}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <span ref={_messageDiv}><br /></span>
            </td>
          </tr>
          <tr>
            <td>
              <div id="resultsDiv" className="panelDiv" >
                <div ref={_resultsContentDiv} style={{ display: 'none' }}>
                  <table>
                    <tr>
                      <td><Label>
                        {labelCampoFecha + ' : '}
                      <DatePicker
                          selectedDate={fechaConsulta}
                          format='yyyy-MMM-dd'
                          hideEmpty={true}
                          runtime={false}
                          onChange={(date) => { setFechaConsulta(date) }} />
                      </Label>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Label>
                          {labelCampoLatitud + ' : '}
                        <NumericInput
                          showHandlers={false}
                          step={0.0001}
                          precision={10}
                          value={latitude}
                          onChange={ (value) => { setLatitude(value) }}/>
                        </Label>
                      </td>
                    </tr>
                    <tr>
                      <td>
                      <Label>
                        {labelCampoLongitud + ' : '}
                        <NumericInput
                          showHandlers={false}
                          step={0.0001}
                          precision={10}
                          value={longitude}
                          onChange={ (value) => { setLongitude(value) }}/>
                        </Label>
                      </td>
                    </tr>
                    <tr>
                      <td>
                      <Label>
                        {labelCampoDestino + ' : '}
                        <TextInput
                          value={valorInterseccion}
                          onChange={ (evt) => { const v = valoresInterseccion; v[0].valor = evt.target.value; setValorInterseccion(evt.target.value); setValoresInterseccion(v) }}/>
                        </Label>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  )
}

export default Widget
