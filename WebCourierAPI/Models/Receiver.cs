using System;
using System.Collections.Generic;

namespace WebCourierAPI.Models;

public partial class Receiver
{
    public int ReceiverId { get; set; }

    public string ReceiverName { get; set; } = null!;

    public string ReceiverPhoneNumber { get; set; } = null!;

    public string ReceiverGmail { get; set; } = null!;

    public virtual ICollection<Parcel> Parcels { get; set; } = new List<Parcel>();
}
