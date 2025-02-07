using System;
using System.Collections.Generic;

namespace WebCourierAPI.Models;

public partial class ParcelType
{
    public int ParcelTypeId { get; set; }

    public string ParcelTypeName { get; set; } = null!;

    public string? CreateBy { get; set; }

    public DateTime? CreateDate { get; set; }

    public string? UpdateBy { get; set; }

    public DateTime? UpdateDate { get; set; }

    public bool IsActive { get; set; }

    public decimal? DefaultPrice { get; set; }

    public virtual ICollection<DeliveryCharge> DeliveryCharges { get; set; } = new List<DeliveryCharge>();

    public virtual ICollection<Parcel> Parcels { get; set; } = new List<Parcel>();
}
