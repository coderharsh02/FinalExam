using ExamApi.Models;

namespace ExamApi.DTOs
{
    public class LeaveApproval
    {
        public int LeaveId { get; set; }
        public bool isApproved { get; set; }
    }
}
