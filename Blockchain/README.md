# Disaster Recovery Network

> This Defines a business network where organizations can send supplies to help resolve current disasters.

This business network defines:

**Participant**
`Supplier`  `Receiver`  `Transporter`

**Assets**
`Supply`  `Disaster`

**Transaction**
`CreateDisaster`  `SendSupply`  `UpdateSupplyLocation`  `SupplyReceived`

A `Supplier` is the owner of `Supply`. By creating a `SendSupply` transaction to a `Receiver` who is located near to a `Disaster` a `Transporter` participant is then created which represents the IOT sensor attached to the supply moving. `Receiver` can then sumbit `SupplyReceived` when `Supply` has reached him. `UpdateSupplyLocation` checks if `Supply` is out of its route it will be considered LOST.

To test this Business Network Definition :

Create `Supplier` participant:

```
{
  "$class": "net.biz.disasterSampleNetwork.Supplier",
  "orgId": "supplier_1",
  "location": "Cairo"
}
```

Create `Receiver` participant:

```
{
  "$class": "net.biz.disasterSampleNetwork.Supplier",
  "orgId": "receiver_1",
  "location": "Helwan"
}
```

Create a `Supply` asset:

```
{
  "$class": "net.biz.disasterSampleNetwork.Supply",
  "supplyId": "supply_0",
  "supplyType": "BLOOD",
  "owner": "resource:net.biz.disasterSampleNetwork.Supplier#supplier_1",
  "state": "OK",
  "amount": 20
}
```

Submit a `CreateDisaster` transaction:

```
{
  "$class": "net.biz.disasterSampleNetwork.CreateDisaster",
  "Id": "disaster_1",
  "location": "Helwan",
  "disasterType": "earthquake"
}
```

This `CreateDisaster` transaction will create new `Disaster` asset with supplies needed for this kind of disasters.


Submit a `SendSupply` transaction:

```
{
  "$class": "net.biz.disasterSampleNetwork.SendSupply",
  "supply": "resource:net.biz.disasterSampleNetwork.Supply#supply_0",
  "receiver": "resource:net.biz.disasterSampleNetwork.Receiver#receiver_1",
  "deviceId": "device_1",
  "route": "route_1",
  "amount": 5
}
```

This `SendSupply` transaction will change the amount of `Supply` asset with the amont of supply sent.


then `UpdateSupplyLocation` transaction will keep checking for the supply location if it gets out of route supply state will change to 'LOST'.

```
{
  "$class": "net.biz.disasterSampleNetwork.updateSupplyLocation",
  "location": "location_retrieve_from_IOT_sensor",
  "supply": "resource:net.biz.disasterSampleNetwork.Supply#supply_0_device_0",
  "receiver": "resource:net.biz.disasterSampleNetwork.Transporter#device_0"
}
```

Submit a `SupplyReceived` transaction:

```
{
  "$class": "net.biz.disasterSampleNetwork.SupplyReceived",
  "receiver": "resource:net.biz.disasterSampleNetwork.Receiver#receiver_1",
  "supply": "resource:net.biz.disasterSampleNetwork.Supply#supply_0_device_0",
  "disaster": "resource:net.biz.disasterSampleNetwork.Disaster#disaster_1"
}
```

This `SupplyReceived` transaction will update the `Disaster` asset with the new supplies and checks if the `Disaster` does no longer have any required supplies it will be marked as fulfilled.

Congratulations!
