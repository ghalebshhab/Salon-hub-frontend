/**
 * Arabic for the messages the server sends (toasts, form errors, notices).
 * The server writes them in English; the API client shows them through t(),
 * so each English text here is a key exactly as the server writes it
 * (spaces and capitals included). Messages that carry a number or a name are
 * in AR_SERVER_PATTERNS at the end.
 */
const AR_SERVER = {
  // ---------- account and sign-in ----------
  "Logged out successfully": "سجّلت خروج",
  "Username must start with a lowercase letter and may contain only letters, numbers, underscores, and dots.":
    "اسم المستخدم لازم يبلش بحرف إنجليزي صغير، وفيه بس حروف وأرقام و _ و .",
  "Email address is required.": "الإيميل مطلوب.",
  "Email address must use a valid email domain.":
    "الإيميل لازم يكون على دومين صحيح.",
  "Phone number is required.": "رقم الهاتف مطلوب.",
  "Phone number must be in one of these formats: +9627XXXXXXXX or 07XXXXXXXX":
    "رقم الهاتف لازم يكون بهالشكل: +9627XXXXXXXX أو 07XXXXXXXX",
  "Password is required.": "كلمة السر مطلوبة.",
  "Email address already exists.": "هالإيميل مسجّل من قبل.",
  "Phone number already exists.": "رقم الهاتف هاد مسجّل من قبل.",
  "Username already exists.": "اسم المستخدم هاد مأخوذ.",
  "User with this email does not exist.": "ما في حساب بهالإيميل.",
  "Your account is not active.": "حسابك مش مفعّل.",
  "Incorrect password. Please try again.": "كلمة السر غلط. جرّب مرة ثانية.",
  "Email verification is required before signing in.":
    "لازم تأكد إيميلك قبل ما تسجّل دخول.",
  "Logged in successfully. Loading...": "سجّلت دخول. عم نحمّل…",
  "First name and last name are required.": "الاسم الأول واسم العيلة مطلوبين.",
  "First name and last name must contain at least 3 characters.":
    "الاسم الأول واسم العيلة لازم يكون كل واحد فيهم 3 أحرف على الأقل.",
  "Username is required.": "اسم المستخدم مطلوب.",
  "User does not exist.": "هالمستخدم مش موجود.",
  "user with this user name dose not exist .": "ما في حساب بهالاسم.",
  "user with this Email dose not exist .": "ما في حساب بهالإيميل.",
  "The verification email could not be delivered. Please try again later.":
    "ما قدرنا نبعت إيميل التأكيد. جرّب كمان شوي.",
  "A new verification code has been sent.": "بعتنالك رمز تأكيد جديد.",
  "Email address and a 6-digit verification code are required.":
    "لازم الإيميل ورمز التأكيد من 6 أرقام.",
  "Email address verified successfully. You can now sign in.":
    "تأكّد إيميلك. هلأ بتقدر تسجّل دخول.",
  "The password reset code is invalid or has expired.":
    "رمز تغيير كلمة السر غلط أو خلصت مدته.",
  "Verification code accepted. You can now set a new password.":
    "الرمز صح. هلأ اختار كلمة سر جديدة.",
  "A valid password reset authorization is required.":
    "لازم إذن صالح لتغيير كلمة السر.",
  "Password confirmation does not match the new password.":
    "تأكيد كلمة السر مش نفس كلمة السر الجديدة.",
  "The password reset authorization is invalid or has expired. Please request a new code.":
    "إذن تغيير كلمة السر غلط أو خلصت مدته. اطلب رمز جديد.",
  "The password could not be reset for this account.":
    "ما قدرنا نغيّر كلمة السر لهالحساب.",
  "Password reset successfully. Please sign in with your new password.":
    "تغيّرت كلمة السر. سجّل دخول بكلمة السر الجديدة.",
  "An authenticated account is required.": "لازم تكون مسجّل دخول.",
  "Your current password is required.": "كلمة السر الحالية مطلوبة.",
  "The authenticated account is not available.": "حسابك مش متاح هلأ.",
  "The current password is incorrect.": "كلمة السر الحالية غلط.",
  "Password changed successfully. Please sign in again on your devices.":
    "تغيّرت كلمة السر. سجّل دخول من جديد على أجهزتك.",
  "The verification code has expired. Please request a new code.":
    "رمز التأكيد خلصت مدته. اطلب رمز جديد.",
  "Too many incorrect attempts. Please request a new verification code.":
    "محاولات غلط كثير. اطلب رمز تأكيد جديد.",
  "The verification code is invalid or has expired.":
    "رمز التأكيد غلط أو خلصت مدته.",
  "Could not secure the verification code.": "ما قدرنا نحمي رمز التأكيد.",
  "Could not secure the password reset authorization.":
    "ما قدرنا نحمي إذن تغيير كلمة السر.",
  "A valid email address is required.": "لازم إيميل صحيح.",
  "If an unverified account exists for this email, a verification code has been sent.":
    "إذا في حساب مش مأكّد بهالإيميل، بعتناله رمز تأكيد.",
  "Email address is already verified.": "الإيميل مأكّد من قبل.",
  "A new verification code was sent.": "بعتنالك رمز تأكيد جديد.",
  "Authenticated user was not found.": "ما لقينا حسابك.",
  "Authenticated user is required": "لازم تكون مسجّل دخول",
  "Active user not found": "ما لقينا المستخدم",
  "User not found": "ما لقينا المستخدم",
  "User id is required": "رقم المستخدم مطلوب",

  // ---------- community ----------
  "Post likes fetched successfully": "انجابوا الإعجابات",
  "Community profile not found": "ما لقينا صفحة العضو",
  "Community profile fetched successfully": "انجابت صفحة العضو",
  "Community member posts fetched successfully": "انجابت منشورات العضو",
  "Active salon not found": "ما لقينا الصالون",
  "Only the salon owner can publish as this salon":
    "بس صاحب الصالون بقدر ينشر باسم الصالون",
  "Community post created successfully": "انتشر المنشور",
  "Community post owned by you was not found": "ما لقينا منشورك",
  "Community post updated successfully": "تعدّل المنشور",
  "Community post deleted successfully": "انحذف المنشور",
  "Post media saved": "انحفظت صور المنشور",
  "Community post or active user not found": "ما لقينا المنشور أو المستخدم",
  "Community post liked": "عجبك المنشور",
  "Community post unliked": "شلت الإعجاب",
  "Post comments fetched successfully": "انجابت التعليقات",
  "Comment content is required": "اكتب التعليق",
  "Comment cannot exceed 2000 characters": "التعليق ما بصير يزيد عن 2000 حرف",
  "Comment added successfully": "انضاف تعليقك",
  "Comment was not found or you cannot delete it":
    "ما لقينا التعليق أو ما بتقدر تحذفه",
  "Comment deleted successfully": "انحذف التعليق",
  "You cannot add yourself as a friend": "ما بتقدر تضيف حالك صاحب",
  "Friend request sent successfully": "انبعت طلب الصداقة",
  "Incoming friend request not found": "ما لقينا طلب الصداقة",
  "Friendship or friend request not found": "ما لقينا الصداقة أو الطلب",
  "Friendship removed successfully": "انشالت الصداقة",
  "Friends fetched successfully": "انجابوا الأصحاب",
  "Incoming friend requests fetched successfully": "انجابت طلبات الصداقة",
  "Active salon or user not found": "ما لقينا الصالون أو المستخدم",
  "Salon followed successfully": "صرت تتابع الصالون",
  "Salon unfollowed successfully": "وقّفت متابعة الصالون",
  "Followed salons fetched successfully": "انجابت الصالونات اللي بتتابعها",
  "Member result size must be between 1 and 30":
    "عدد النتائج لازم يكون بين 1 و 30",
  "Community members fetched successfully": "انجابوا الأعضاء",
  "Page must be non-negative and size must be between 1 and 50":
    "رقم الصفحة ما بصير يكون سالب، وحجمها بين 1 و 50",
  "Community feed fetched successfully": "انجابت آخر المنشورات",
  "Community post not found": "ما لقينا المنشور",
  "Community post fetched successfully": "انجاب المنشور",

  // ---------- photos and videos ----------
  "Media deletion is not configured. Add the Cloudinary environment credentials and retry.":
    "حذف الصور مش جاهز هلأ. جرّب بعدين.",
  "The stored media asset identifier is missing.":
    "معلومات الملف المحفوظ ناقصة.",
  "The stored media resource type is not supported.":
    "نوع الملف المحفوظ مش مدعوم.",
  "Cloudinary did not confirm deletion of the stored media. Please retry.":
    "ما تأكّد حذف الملف. جرّب مرة ثانية.",
  "Media deleted": "انحذف الملف",
  "The stored media could not be deleted from Cloudinary.":
    "ما قدرنا نحذف الملف.",
  "Not a Cloudinary media URL.": "هالرابط مش لملف عنا.",
  "Not a Cloudinary media URL of this account.": "هالرابط مش لملف عنا.",
  "Cloudinary did not return a usable media URL.": "ما وصلنا رابط صالح للملف.",
  "Media uploaded successfully": "انرفع الملف",
  "Media uploads are not configured. Add the Cloudinary environment credentials and restart the backend.":
    "رفع الصور مش جاهز هلأ. جرّب بعدين.",
  "The media file could not be uploaded. Please verify the file and try again.":
    "ما قدرنا نرفع الملف. تأكد منه وجرّب مرة ثانية.",
  "Enter a valid public HTTPS Google Drive image or video link.":
    "حط رابط Google Drive عام وصحيح لصورة أو فيديو (HTTPS).",
  "Cloudinary could not read that Google Drive file. Make sure its sharing setting is 'Anyone with the link'.":
    "ما قدرنا نقرأ ملف Google Drive. تأكد إن المشاركة عليه 'أي حدا معه الرابط'.",
  "Work media deleted successfully": "انحذف الشغل",
  "Sign in with an active account to change your picture.":
    "سجّل دخول بحساب مفعّل عشان تغيّر صورتك.",
  "Your profile picture must be an image.": "صورتك لازم تكون صورة.",
  "Profile picture updated": "تغيّرت صورتك",
  "The salon profile picture must be an image.": "صورة الصالون لازم تكون صورة.",
  "Salon profile picture updated": "تغيّرت صورة الصالون",
  "A work-media caption cannot exceed 300 characters.":
    "وصف الشغل ما بصير يزيد عن 300 حرف.",
  "Work media published successfully": "انتشر شغلك",
  "Create your salon before uploading its profile picture.":
    "سوّي صالونك قبل ما ترفع صورته.",
  "Only an active salon employee can publish work media.":
    "بس موظف مفعّل بالصالون بقدر ينشر شغل.",
  "Salon work media fetched successfully": "انجاب شغل الصالون",
  "Work media was not found or does not belong to you.":
    "ما لقينا الشغل أو مش إلك.",

  // ---------- reports ----------
  "Report target and reason are required": "لازم تحدد شو بدك تبلّغ عنه والسبب",
  "The reported item is no longer available": "الإشي اللي بلّغت عنه مش موجود",
  "You already have an open report for this item":
    "إلك بلاغ مفتوح عن هالإشي من قبل",
  "Report details cannot exceed 1000 characters":
    "تفاصيل البلاغ ما بصير تزيد عن 1000 حرف",
  "Report submitted for administrator review": "انبعت البلاغ للإدارة",
  "Administrator access required": "لازم صلاحية مسؤول",
  "Moderation reports fetched successfully": "انجابت البلاغات",
  "Report must be resolved or dismissed": "البلاغ لازم ينحل أو ينرفض",
  "Moderation report not found": "ما لقينا البلاغ",
  "Admin note cannot exceed 1000 characters":
    "ملاحظة المسؤول ما بصير تزيد عن 1000 حرف",
  "Moderation report updated": "تعدّل البلاغ",

  // ---------- notifications ----------
  "Notification marked as read": "انعلّم الإشعار كمقروء",
  "All notifications marked as read": "كل الإشعارات انعلّمت كمقروءة",
  "Notification page cannot be negative": "رقم الصفحة ما بصير يكون سالب",
  "Notification page size must be between 1 and 100":
    "حجم الصفحة لازم يكون بين 1 و 100",
  "Notifications fetched successfully": "انجابت الإشعارات",
  "Unread notification count fetched successfully":
    "انجاب عدد الإشعارات الجديدة",
  "Notification owned by you was not found": "ما لقينا الإشعار",

  // ---------- owner dashboard and reports ----------
  "An active, approved salon owned by you is required":
    "لازم يكون إلك صالون مفعّل ومقبول",
  "Send both a start and an end date.": "ابعت تاريخ البداية والنهاية.",
  "Bookings exported": "انصدّرت الحجوزات",
  "Owner dashboard fetched successfully.": "انجابت لوحة الصالون.",
  "Authenticated salon owner is required.": "لازم تكون صاحب صالون مسجّل دخول.",
  "The start date cannot be after the end date.":
    "تاريخ البداية ما بصير يكون بعد تاريخ النهاية.",
  "The start date cannot be after the end date":
    "تاريخ البداية ما بصير يكون بعد تاريخ النهاية",
  "Choose a period of at most one year.": "اختار فترة سنة أو أقل.",
  "Choose a period of at most one year": "اختار فترة سنة أو أقل",
  "Owner dashboard summary fetched successfully": "انجاب ملخص الصالون",

  // ---------- payments ----------
  "Cash payment recorded": "انسجّل الدفع كاش",
  "Booking was not found": "ما لقينا الحجز",
  "This booking was made before payments were recorded":
    "هالحجز انعمل قبل ما نصير نسجّل الدفعات",
  "Payment fetched successfully": "انجابت الدفعة",
  "Booking of your salon was not found": "ما لقينا الحجز بصالونك",
  "Cash payment was already recorded": "الدفع كاش مسجّل من قبل",
  "Unpaid appointments fetched successfully": "انجابت المواعيد اللي ما اندفعت",
  "Payment summary fetched successfully": "انجاب ملخص الدفعات",
  "Payment settings saved": "انحفظت إعدادات الدفع",
  "Payment options fetched successfully": "انجابت طرق الدفع",
  "Payment settings fetched successfully": "انجابت إعدادات الدفع",

  // ---------- booking times ----------
  "Every selected service must be active and belong to this salon":
    "كل خدمة اخترتها لازم تكون شغّالة وتابعة لهالصالون",
  "Selected employee cannot perform every requested service":
    "الموظف اللي اخترته ما بعمل كل الخدمات المطلوبة",
  "Available appointment times fetched successfully": "انجابت المواعيد الفاضية",
  "Booking and reschedule date are required":
    "الحجز وتاريخ الموعد الجديد مطلوبين",
  "Reschedule date cannot be in the past":
    "تاريخ الموعد الجديد ما بصير يكون فات",
  "Assigned employee can no longer perform every requested service":
    "الموظف المعيّن صار ما بعمل كل الخدمات المطلوبة",
  "Reschedule appointment times fetched successfully":
    "انجابت المواعيد الفاضية للتغيير",
  "Availability information is required": "معلومات الموعد مطلوبة",
  "At least one service is required": "اختار خدمة وحدة على الأقل",
  "Availability cannot contain more than 10 services":
    "ما بصير تختار أكثر من 10 خدمات",
  "Every service id is required": "كل خدمة لازم يكون إلها رقم",
  "A service can be selected only once": "كل خدمة بتنختار مرة وحدة بس",
  "Booking date is required": "تاريخ الحجز مطلوب",
  "Booking date cannot be in the past": "تاريخ الحجز ما بصير يكون فات",
  "Availability information is valid": "معلومات الموعد صحيحة",

  // ---------- bookings ----------
  "A service can be selected only once per booking":
    "كل خدمة بتنختار مرة وحدة بالحجز",
  "Selected employee is not active in this salon":
    "الموظف اللي اخترته مش شغّال بهالصالون",
  "Customer phone number is required": "رقم هاتف الزبون مطلوب",
  "Customer phone number cannot exceed 30 characters":
    "رقم هاتف الزبون ما بصير يزيد عن 30 خانة",
  "The requested appointment must fit inside the salon opening hours":
    "الموعد لازم يكون ضمن ساعات دوام الصالون",
  "Selected employee is not working for the full requested appointment":
    "الموظف اللي اخترته مش داوم طول مدة الموعد",
  "Selected appointment time is no longer available":
    "الوقت اللي اخترته ما عاد فاضي",
  "Booking request created successfully": "انبعت طلب الحجز",
  "Customer bookings fetched successfully": "انجابت حجوزاتك",
  "Salon bookings fetched successfully": "انجابت حجوزات الصالون",
  "Pending salon bookings fetched successfully": "انجابت الحجوزات المستنية",
  "You are not an active salon employee": "إنت مش موظف مفعّل بصالون",
  "Employee bookings fetched successfully": "انجابت مواعيدك",
  "Booking for your active salon was not found": "ما لقينا الحجز بصالونك",
  "Only a pending booking can be accepted": "بس الحجز المستني بنقبل",
  "The customer must decide the reschedule proposal before acceptance":
    "الزبون لازم يرد على الموعد المقترح قبل القبول",
  "A booking with a past appointment time cannot be accepted":
    "ما بصير تقبل حجز موعده فات",
  "Choose the employee who will serve this customer before accepting":
    "اختار مين رح يخدم الزبون قبل ما تقبل",
  "Booking accepted successfully": "انقبل الحجز",
  "Only a pending booking can be rejected": "بس الحجز المستني بنرفض",
  "Booking rejected successfully": "انرفض الحجز",
  "Booking owned by you was not found": "ما لقينا حجزك",
  "Only a pending or accepted booking can be cancelled":
    "بس الحجز المستني أو المقبول بتلغى",
  "Only a confirmed appointment can be confirmed by the customer":
    "بس الموعد المأكّد بتقدر تأكّد إنك جاي عليه",
  "This appointment has already started": "هالموعد بلّش",
  "Thanks, the salon knows you are coming": "شكراً، الصالون عرف إنك جاي",
  "Only an accepted or running booking can be completed":
    "بس الحجز المقبول أو اللي شغّال بخلص",
  "Booking completed successfully": "خلص الحجز",
  "An employee can be assigned only to a pending or accepted booking":
    "بتقدر تعيّن موظف بس لحجز مستني أو مقبول",
  "Please explain the employee change to the customer":
    "اشرح للزبون ليش تغيّر الموظف",
  "Employee assigned successfully": "تعيّن الموظف",
  "Assignable employees fetched successfully": "انجابوا الموظفين المتاحين",
  "A booking cannot contain more than 10 services":
    "الحجز ما بصير يكون فيه أكثر من 10 خدمات",
  "Customer location is required": "مكان الزبون مطلوب",
  "Customer location cannot exceed 255 characters":
    "مكان الزبون ما بصير يزيد عن 255 حرف",
  "Booking note cannot exceed 1000 characters":
    "ملاحظة الحجز ما بصير تزيد عن 1000 حرف",
  "Booking date and time are required": "تاريخ ووقت الحجز مطلوبين",
  "Booking date and time must be in the future":
    "تاريخ ووقت الحجز لازم يكونوا بالمستقبل",
  "Booking information is valid": "معلومات الحجز صحيحة",
  "A rejection reason is required": "سبب الرفض مطلوب",
  "Owner note cannot exceed 1000 characters":
    "ملاحظة الصالون ما بصير تزيد عن 1000 حرف",
  "Booking action is valid": "الإجراء صحيح",
  "Booking information is required": "معلومات الحجز مطلوبة",
  "Active customer not found": "ما لقينا الزبون",
  "Booking id is required": "رقم الحجز مطلوب",

  // ---------- new appointment times ----------
  "Reschedule proposal sent to the customer": "انبعت الموعد المقترح للزبون",
  "Reschedule proposal for your booking was not found":
    "ما لقينا الموعد المقترح لحجزك",
  "Reschedule proposal was already accepted": "الموعد المقترح انقبل من قبل",
  "Only a pending reschedule proposal can be accepted":
    "بس الموعد المقترح المستني بنقبل",
  "This booking can no longer be rescheduled": "هالحجز ما عاد بتغيّر موعده",
  "The proposed appointment time is no longer available":
    "الوقت المقترح ما عاد فاضي",
  "Appointment rescheduled successfully": "تغيّر الموعد",
  "Reschedule proposal was already rejected": "الموعد المقترح انرفض من قبل",
  "Only a pending reschedule proposal can be rejected":
    "بس الموعد المقترح المستني بنرفض",
  "Proposed date and time are required": "تاريخ ووقت الموعد المقترح مطلوبين",
  "Reschedule note cannot exceed 1000 characters":
    "ملاحظة الموعد الجديد ما بصير تزيد عن 1000 حرف",
  "Proposed appointment must differ from the current appointment":
    "الموعد المقترح لازم يكون غير الموعد الحالي",
  "Reschedule proposal is valid": "الموعد المقترح صحيح",
  "Only a pending or accepted future booking can be rescheduled":
    "بس الحجز الجاي المستني أو المقبول بتغيّر موعده",
  "Reschedule date is required": "تاريخ الموعد الجديد مطلوب",
  "The customer must decide the current reschedule proposal first":
    "الزبون لازم يرد على الموعد المقترح الحالي أول",
  "Selected reschedule time is no longer available":
    "الوقت الجديد اللي اخترته ما عاد فاضي",

  // ---------- leave alerts and live tracking ----------
  "Leave alerts are off and your place is forgotten":
    "وقّفنا تنبيهات الطلعة ونسينا مكانك",
  "Departure plan fetched successfully": "انجابت خطة الطلعة",
  "Leave alerts are available only for an upcoming confirmed appointment":
    "تنبيهات الطلعة بس لموعد جاي ومأكّد",
  "You are already on the way or at the salon": "إنت بالطريق أو بالصالون أصلاً",
  "We will tell you when to leave": "رح نقلك إيمتى تطلع",
  "Trip sharing is not active for this booking":
    "مشاركة الطريق مش شغّالة لهالحجز",
  "Position update skipped": "ما تحدّث المكان",
  "Position updated": "تحدّث المكان",
  "Arrival shared with the salon": "الصالون عرف إنك وصلت",
  "Trip sharing stopped": "وقفت مشاركة الطريق",
  "Booking assigned to you was not found": "ما لقينا الموعد المعيّن إلك",
  "Only a confirmed appointment can be started": "بس الموعد المأكّد ببلّش",
  "Assign an employee before starting the service":
    "عيّن موظف قبل ما تبلّش الخدمة",
  "The service can be started only on the appointment day":
    "الخدمة بتبلّش بس بيوم الموعد",
  "Finish the current client's service before starting another one":
    "خلّص خدمة الزبون الحالي قبل ما تبلّش غيرها",
  "Service started": "بلّشت الخدمة",
  "Only a running service can be extended": "بس الخدمة الشغّالة بتتمدّد",
  "Expected end time updated": "تحدّث وقت الخلصة المتوقع",
  "Only a confirmed or running appointment can be completed":
    "بس الموعد المأكّد أو الشغّال بخلص",
  "Service completed": "خلصت الخدمة",
  "Booking tracking fetched successfully": "انجابت متابعة الموعد",
  "You are already marked as arrived": "إنت مسجّل إنك وصلت",
  "Trip sharing started": "بلّشت مشاركة الطريق",

  // ---------- closures, team and schedules ----------
  "Closure saved": "انحفظ الإغلاق",
  "Closure of your salon was not found": "ما لقينا الإغلاق بصالونك",
  "Closure removed": "انشال الإغلاق",
  "Salon closures fetched successfully": "انجابت أيام الإغلاق",
  "These dates overlap another closure of the salon":
    "هالأيام داخلة بإغلاق ثاني للصالون",
  "Every assigned service must be active and belong to your salon":
    "كل خدمة لازم تكون شغّالة وتابعة لصالونك",
  "Employee service capabilities updated successfully": "تحدّثت خدمات الموظف",
  "Employee in your salon was not found": "ما لقينا الموظف بصالونك",
  "Employee service capabilities fetched successfully": "انجابت خدمات الموظف",
  "Active employee in your salon was not found": "ما لقينا موظف مفعّل بصالونك",
  "A service can be assigned only once to an employee":
    "الخدمة بتنعطى للموظف مرة وحدة بس",
  "Employee schedule updated successfully": "تحدّث دوام الموظف",
  "Day, start time, and end time are required for every period":
    "كل فترة لازم إلها يوم ووقت بداية ووقت نهاية",
  "Working period start time must be before end time":
    "بداية الفترة لازم تكون قبل نهايتها",
  "Every working period must be inside the salon opening hours":
    "كل فترة دوام لازم تكون ضمن ساعات الصالون",
  "Working periods on the same day cannot overlap":
    "فترات الدوام بنفس اليوم ما بصير تتداخل",
  "Employee schedule is valid": "الدوام صحيح",
  "Employee schedule fetched successfully": "انجاب دوام الموظف",
  "An employee schedule cannot contain more than 28 weekly periods":
    "الدوام ما بصير يكون فيه أكثر من 28 فترة بالأسبوع",
  "Time off saved": "انحفظت الإجازة",
  "Time off in your salon was not found": "ما لقينا الإجازة بصالونك",
  "Time off removed": "انشالت الإجازة",
  "Employee time off fetched successfully": "انجابت إجازات الموظف",
  "This time off overlaps another time off for the same employee":
    "هالإجازة داخلة بإجازة ثانية لنفس الموظف",
  "Salon employees fetched successfully": "انجابوا موظفين الصالون",
  "Salon team fetched successfully": "انجاب فريق الصالون",
  "Say if the employee is a manager": "حدد إذا الموظف مدير",
  "Only the owner of an active salon can choose managers":
    "بس صاحب صالون مفعّل بختار المدراء",
  "Employee of your salon was not found": "ما لقينا الموظف بصالونك",

  // ---------- joining and leaving salons ----------
  "This salon has already invited you.": "هالصالون عازمك من قبل.",
  "You are not allowed to accept this invitation": "ما بتقدر تقبل هالدعوة",
  "The salon is not active": "الصالون مش مفعّل",
  "The salon is already full": "الصالون مليان",
  "You already have a pending request for this salon.":
    "إلك طلب مستني لهالصالون من قبل.",
  "Invitation accepted successfully": "انقبلت الدعوة",
  "You already have a completed leave request": "إلك طلب ترك شغل مخلّص من قبل",
  "Invitation accepted. A leave request has been sent to your current salon owner.":
    "انقبلت الدعوة. انبعت طلب ترك شغل لصاحب صالونك الحالي.",
  "Employment requests fetched successfully.": "انجابت طلبات الشغل.",
  "An active salon owned by you is required.": "لازم يكون إلك صالون مفعّل.",
  "Salon employment requests fetched successfully.":
    "انجابت طلبات الشغل بالصالون.",
  "Leave requests fetched successfully.": "انجابت طلبات ترك الشغل.",
  "Salon leave requests fetched successfully.":
    "انجابت طلبات ترك الشغل بالصالون.",
  "Request to this salon Successfully done": "انبعت طلبك للصالون",
  "Candidate search cannot exceed 100 characters.":
    "البحث ما بصير يزيد عن 100 حرف.",
  "Career candidates fetched successfully.": "انجابوا المرشحين.",
  "This Employment Request is not found": "ما لقينا طلب الشغل",
  "This Employment Request is no longer pending": "طلب الشغل ما عاد مستني",
  "Salon associated with this request was not found":
    "ما لقينا الصالون تبع هالطلب",
  "Salon is not active, you cannot accept this request":
    "الصالون مش مفعّل، ما بتقدر تقبل الطلب",
  "Only the salon owner can accept this request":
    "بس صاحب الصالون بقدر يقبل هالطلب",
  "Only the invited user can accept this invitation":
    "بس الشخص المعزوم بقدر يقبل الدعوة",
  "Invalid employment request type": "نوع طلب الشغل غلط",
  "This user cannot join the salon": "هالشخص ما بقدر ينضم للصالون",
  "This employee already has a pending leave request":
    "هالموظف إله طلب ترك شغل مستني",
  "Request accepted. A leave request has been sent to your current salon owner.":
    "انقبل الطلب. انبعت طلب ترك شغل لصاحب صالونك الحالي.",
  "Employment Request Accepted successfully": "انقبل طلب الشغل",
  "Receiver not found": "ما لقينا المستلم",
  "Salon is not active.": "الصالون مش مفعّل.",
  "You are not the owner of this salon": "إنت مش صاحب هالصالون",
  "You can not invite yourself": "ما بتقدر تعزم حالك",
  "Only active users can be invited to a salon.":
    "بس المستخدمين المفعّلين بنعزموا للصالون.",
  "This user must enable their career profile before they can be invited.":
    "هالشخص لازم يفعّل ملفه المهني قبل ما تعزمه.",
  "Only career users or employees can be invited to a salon.":
    "بس أصحاب الملف المهني أو الموظفين بنعزموا للصالون.",
  "This user already works at your salon.": "هالشخص بشتغل بصالونك أصلاً.",
  "This user has already requested to join your salon.":
    "هالشخص طلب ينضم لصالونك من قبل.",
  "This user already has a pending invitation.": "هالشخص إله دعوة مستنية.",
  "Invitation sent successfully": "انبعتت الدعوة",
  "Only the salon owner can reject this request":
    "بس صاحب الصالون بقدر يرفض هالطلب",
  "Only the invited user can reject this invitation":
    "بس الشخص المعزوم بقدر يرفض الدعوة",
  "Employment Request rejected successfully": "انرفض طلب الشغل",
  "You are not the sender of this request": "إنت مش اللي بعت هالطلب",
  "The request is cancelled successfully": "انلغى الطلب",
  "You are not currently an employee": "إنت مش موظف هلأ",
  "You are not currently working in a salon": "إنت مش شغّال بصالون هلأ",
  "Sender not found": "ما لقينا المرسل",
  "You already have a pending leave request": "إلك طلب ترك شغل مستني",
  "Leave request sent successfully": "انبعت طلب ترك الشغل",
  "Leave request not found": "ما لقينا طلب ترك الشغل",
  "This leave request is no longer pending": "طلب ترك الشغل ما عاد مستني",
  "Only the salon owner can accept this leave request":
    "بس صاحب الصالون بقدر يقبل طلب ترك الشغل",
  "Your role dont allow you to join the salon as employee":
    "دورك ما بسمحلك تنضم للصالون كموظف",
  "This employee is no longer working in this salon":
    "هالموظف ما عاد بشتغل بهالصالون",
  "Salon is not active , you can not join ": "الصالون مش مفعّل، ما بتقدر تنضم",
  "Leave request accepted successfully": "انقبل طلب ترك الشغل",
  "The target salon is already full": "الصالون الثاني مليان",
  "Salon is already full": "الصالون مليان",
  "The employment request is not ready for transfer": "طلب الشغل مش جاهز للنقل",
  "Employee successfully transferred to the new salon":
    "انتقل الموظف للصالون الجديد",
  "Only the employee that sent this leave request can cancel it":
    "بس الموظف اللي بعت طلب ترك الشغل بقدر يلغيه",
  "Leave request cancelled successfully": "انلغى طلب ترك الشغل",
  "Employment request not found": "ما لقينا طلب الشغل",
  "This invitation is no longer pending": "الدعوة ما عادت مستنية",
  "This request is not an invitation": "هالطلب مش دعوة",

  // ---------- hiring posts ----------
  "Hiring post information is required": "معلومات إعلان الوظيفة مطلوبة",
  "Title is required and must contain at least 3 characters":
    "العنوان مطلوب ولازم يكون 3 أحرف على الأقل",
  "Description is required and must contain at least 10 characters":
    "الوصف مطلوب ولازم يكون 10 أحرف على الأقل",
  "Minimum age is required and cannot be less than 18":
    "أقل عمر مطلوب وما بصير يكون أقل من 18",
  "Maximum age is required and must be greater than or equal to minimum age":
    "أكبر عمر مطلوب ولازم يكون أكبر من أو بساوي أقل عمر",
  "Required employee location is required": "مكان الموظف المطلوب لازم ينكتب",
  "Minimum years of experience is required and cannot be negative":
    "أقل سنين خبرة مطلوبة وما بصير تكون سالبة",
  "Number of positions is required and must be greater than 0":
    "عدد الشواغر مطلوب ولازم يكون أكبر من 0",
  "Expiration date is required and must be in the future":
    "تاريخ الانتهاء مطلوب ولازم يكون بالمستقبل",
  "Hiring post information is valid": "معلومات الإعلان صحيحة",
  "Application information is required": "معلومات الطلب مطلوبة",
  "Application note cannot exceed 2000 characters":
    "ملاحظة الطلب ما بصير تزيد عن 2000 حرف",
  "Application information is valid": "معلومات الطلب صحيحة",
  "Open hiring posts fetched successfully": "انجابت الوظايف المفتوحة",
  "Owner not found": "ما لقينا صاحب الصالون",
  "Only salon owners can create hiring posts":
    "بس أصحاب الصالونات بنزّلوا إعلانات وظايف",
  "Salon not found for this owner": "ما لقينا صالون لصاحبه",
  "Your salon must be accepted before creating a hiring post":
    "صالونك لازم ينقبل قبل ما تنزّل إعلان وظيفة",
  "At least one required skill is needed": "لازم مهارة وحدة على الأقل",
  "Owner hiring posts fetched successfully": "انجابت إعلانات وظايفك",
  "Hiring post not found": "ما لقينا إعلان الوظيفة",
  "Only the salon owner can inspect this hiring post":
    "بس صاحب الصالون بقدر يشوف هالإعلان",
  "Owner hiring post fetched successfully": "انجاب إعلان الوظيفة",
  "Only the salon owner can update this hiring post":
    "بس صاحب الصالون بقدر يعدّل هالإعلان",
  "Use the reopen action to extend an expired post":
    "استعمل إعادة الفتح عشان تمدّد إعلان منتهي",
  "Resulting available positions value is too large": "عدد الشواغر كبير كثير",
  "Hiring post updated successfully": "تعدّل إعلان الوظيفة",
  "Only the salon owner can close this hiring post":
    "بس صاحب الصالون بقدر يسكّر هالإعلان",
  "Only an open hiring post can be closed": "بس الإعلان المفتوح بتسكّر",
  "Hiring post closed successfully": "تسكّر إعلان الوظيفة",
  "Only the salon owner can reopen this hiring post":
    "بس صاحب الصالون بقدر يفتح هالإعلان من جديد",
  "This hiring post is already open": "هالإعلان مفتوح أصلاً",
  "Add at least one position because this post has no restored availability":
    "ضيف شاغر واحد على الأقل، لأنه ما ضل شواغر بهالإعلان",
  "Hiring post reopened successfully": "انفتح الإعلان من جديد",
  "Applicant not found": "ما لقينا المتقدّم",
  "Only users and employees can apply to hiring posts":
    "بس المستخدمين والموظفين بقدروا يقدّموا على الوظايف",
  "Enable career mode and complete your career information before applying":
    "فعّل ملفك المهني وكمّل معلوماتك قبل ما تقدّم",
  "This hiring post is not open for applications": "هالإعلان مش مفتوح للطلبات",
  "This hiring post has expired": "هالإعلان خلصت مدته",
  "This salon is not active": "هالصالون مش مفعّل",
  "You are already an employee in this salon": "إنت موظف بهالصالون أصلاً",
  "You have already applied to this hiring post": "قدّمت على هالوظيفة من قبل",
  "Application sent successfully": "انبعت طلبك",
  "Only the salon owner can view these applications":
    "بس صاحب الصالون بقدر يشوف هالطلبات",
  "Hiring applications fetched and ranked successfully":
    "انجابت الطلبات ورتّبناها",
  "Hiring application not found": "ما لقينا الطلب",
  "Only the salon owner can accept this application":
    "بس صاحب الصالون بقدر يقبل هالطلب",
  "This hiring post is not open": "هالإعلان مش مفتوح",
  "This hiring post has no available positions": "ما ضل شواغر بهالإعلان",
  "Only the salon owner can reject this application":
    "بس صاحب الصالون بقدر يرفض هالطلب",
  "Hiring application rejected successfully": "انرفض الطلب",
  "Hiring application history fetched successfully": "انجاب سجل الطلبات",
  "Only the applicant can cancel the linked join request":
    "بس المتقدّم بقدر يلغي طلب الانضمام",
  "Only a requested or pending-transfer join request can be cancelled":
    "بس طلب الانضمام المبعوت أو المستني النقل بلغى",
  "Hiring post update information is required": "معلومات التعديل مطلوبة",
  "At least one editable field is required": "عدّل إشي واحد على الأقل",
  "Title must contain at least 3 characters":
    "العنوان لازم يكون 3 أحرف على الأقل",
  "Description must contain at least 10 characters":
    "الوصف لازم يكون 10 أحرف على الأقل",
  "Expiration date must be in the future": "تاريخ الانتهاء لازم يكون بالمستقبل",
  "Additional positions cannot be negative":
    "الشواغر الزيادة ما بصير تكون سالبة",
  "Additional positions value is too large": "عدد الشواغر الزيادة كبير كثير",
  "Hiring post update is valid": "التعديل صحيح",
  "A new expiration date is required": "تاريخ انتهاء جديد مطلوب",
  "The new expiration date must be in the future":
    "تاريخ الانتهاء الجديد لازم يكون بالمستقبل",
  "Hiring post reopen information is valid": "معلومات إعادة الفتح صحيحة",
  "Search information is required": "معلومات البحث مطلوبة",
  "Page number cannot be negative": "رقم الصفحة ما بصير يكون سالب",
  "Page size must be between 1 and 50": "حجم الصفحة لازم يكون بين 1 و 50",
  "Maximum required experience cannot be negative":
    "أكبر خبرة مطلوبة ما بصير تكون سالبة",
  "Sort option must be newest, expiringSoon, or experienceAscending":
    "الترتيب لازم يكون الأحدث، أو اللي رح يخلص قريب، أو حسب الخبرة",
  "Hiring-post search information is valid": "معلومات البحث صحيحة",

  // ---------- reviews ----------
  "Salon review summary fetched successfully": "انجاب ملخص التقييمات",
  "Your reviews fetched successfully": "انجابت تقييماتك",
  "Review owned by you was not found": "ما لقينا تقييمك",
  "Review deleted successfully": "انحذف التقييم",
  "Rating must be between 1 and 5": "التقييم لازم يكون من 1 لـ 5",
  "Review comment cannot exceed 2000 characters":
    "التعليق ما بصير يزيد عن 2000 حرف",
  "Completed booking owned by you was not found": "ما لقينا حجزك المخلّص",
  "Only a completed booking can be reviewed": "بس الحجز المخلّص بتقيّمه",
  "The salon is not currently available for reviews":
    "الصالون مش متاح للتقييم هلأ",
  "This booking has already been reviewed": "قيّمت هالحجز من قبل",
  "Review added successfully": "انضاف تقييمك",
  "Salon reviews fetched successfully": "انجابت تقييمات الصالون",

  // ---------- salons ----------
  "Select the salon location on the map so the pin can be saved":
    "حدد مكان الصالون على الخريطة عشان ينحفظ",
  "Latitude and longitude must be provided together":
    "خط العرض وخط الطول لازم ينبعتوا مع بعض",
  "The selected coordinates are not valid": "الإحداثيات اللي اخترتها غلط",
  "The selected salon location must be inside Jordan":
    "مكان الصالون لازم يكون بالأردن",
  "Enter a valid HTTPS Google Maps location URL":
    "حط رابط Google Maps صحيح (HTTPS)",
  "Closing Time is Required": "وقت السكّرة مطلوب",
  "Opening Time must be before Closing Time ":
    "وقت الفتح لازم يكون قبل وقت السكّرة",
  "Max number of employees is required and must be greater than 0":
    "أكبر عدد موظفين مطلوب ولازم يكون أكبر من 0",
  "Salon Creation Requested": "انبعت طلب الصالون",
  "Salon Not Found": "ما لقينا الصالون",
  "You can only update your salon": "بتقدر تعدّل صالونك بس",
  "Salon Phone Number must be in one of these formats: 07XXXXXXXX or +9627XXXXXXXX":
    "رقم الصالون لازم يكون بهالشكل: 07XXXXXXXX أو +9627XXXXXXXX",
  "Salon Email is Required , And must be in valid domain":
    "إيميل الصالون مطلوب ولازم يكون على دومين صحيح",
  "Salon City is Required , And must a valid jordanian city":
    "مدينة الصالون مطلوبة ولازم تكون مدينة أردنية",
  "Opening Time is Required and must be before Closing Time ":
    "وقت الفتح مطلوب ولازم يكون قبل وقت السكّرة",
  "Closing Time is Required and must be After Opening Time ":
    "وقت السكّرة مطلوب ولازم يكون بعد وقت الفتح",
  "Salon updated Successfully": "تعدّل الصالون",
  "You can only delete your own salon": "بتقدر تحذف صالونك بس",
  "Salon Deleted Successfully": "انحذف الصالون",
  "Salon is not available": "الصالون مش متاح",
  "Salon Fetched Successfully": "انجاب الصالون",
  "Salons Fetched Successfully": "انجابت الصالونات",
  "Active Salons Fetched Successfully": "انجابت الصالونات المفعّلة",
  "Requested Salons Fetched Successfully": "انجابت طلبات الصالونات",
  "You can only resubmit your salon request": "بتقدر تعيد بعت طلب صالونك بس",
  "Only a rejected salon request can be resubmitted":
    "بس طلب الصالون المرفوض بنبعت من جديد",
  "Salon resubmitted successfully": "انبعت طلب الصالون من جديد",
  "Location details are required": "تفاصيل المكان مطلوبة",
  "You already have a salon request under review": "إلك طلب صالون تحت المراجعة",
  "You have reached the maximum of 3 salon resubmissions":
    "وصلت لأكثر عدد مسموح، 3 مرات إعادة بعت",
  "Edit and resubmit your existing rejected salon request":
    "عدّل طلب صالونك المرفوض وابعته من جديد",
  "You already have a salon": "إلك صالون أصلاً",
  "You are Owner for an Another Salon": "إنت صاحب صالون ثاني",
  "Salon Name is Required and must be more than 3 characters":
    "اسم الصالون مطلوب ولازم يكون أكثر من 3 أحرف",
  "Salon City is Required , and must be a valid jordanian city .":
    "مدينة الصالون مطلوبة ولازم تكون مدينة أردنية.",
  "Salon Description is Required and must be more than 10 characters":
    "وصف الصالون مطلوب ولازم يكون أكثر من 10 أحرف",
  "Salon Email is Invalid": "إيميل الصالون غلط",
  "Salon Email Already Exists": "إيميل الصالون مسجّل من قبل",
  "Phone number can not be null and must be like +9627XXXXXXXX or 07XXXXXXXX":
    "رقم الهاتف مطلوب ولازم يكون بهالشكل: +9627XXXXXXXX أو 07XXXXXXXX",
  "Salon Phone Number already exists": "رقم الصالون مسجّل من قبل",
  "Opening Time is Required": "وقت الفتح مطلوب",
  "Salon id is required": "رقم الصالون مطلوب",
  "Salon owner not found": "ما لقينا صاحب الصالون",

  // ---------- services ----------
  "An active, approved salon owned by you is required to manage services":
    "لازم يكون إلك صالون مفعّل ومقبول عشان ترتّب الخدمات",
  "Salon services fetched successfully": "انجابت خدمات الصالون",
  "Salon service owned by you was not found": "ما لقينا الخدمة بصالونك",
  "Only an active, approved salon can update services":
    "بس الصالون المفعّل والمقبول بعدّل الخدمات",
  "Service active status is required": "حالة الخدمة مطلوبة",
  "Salon service updated successfully": "تعدّلت الخدمة",
  "Only an active, approved salon can disable services":
    "بس الصالون المفعّل والمقبول بوقّف الخدمات",
  "Salon service disabled successfully": "توقّفت الخدمة",
  "Service name cannot exceed 100 characters":
    "اسم الخدمة ما بصير يزيد عن 100 حرف",
  "Service description cannot exceed 1000 characters":
    "وصف الخدمة ما بصير يزيد عن 1000 حرف",
  "Service price must be greater than 0": "سعر الخدمة لازم يكون أكبر من 0",
  "Service price cannot have more than 2 decimal places":
    "سعر الخدمة ما بصير يكون فيه أكثر من خانتين بعد الفاصلة",
  "Service price is too large": "سعر الخدمة كبير كثير",
  "Service duration must be greater than 0 minutes":
    "مدة الخدمة لازم تكون أكثر من 0 دقيقة",
  "Salon service information is valid": "معلومات الخدمة صحيحة",
  "An active, approved salon owned by you is required to create services":
    "لازم يكون إلك صالون مفعّل ومقبول عشان تضيف خدمات",
  "Salon service created successfully": "انضافت الخدمة",
  "Active salon services fetched successfully": "انجابت خدمات الصالون",

  // ---------- plans ----------
  "Plans fetched successfully": "انجابت الباقات",
  "Salon plans fetched successfully": "انجابت باقات الصالونات",
  "Request not found": "ما لقينا الطلب",
  "This request is already reviewed": "هالطلب انراجع من قبل",
  "Payment confirmed and plan turned on": "تأكّد الدفع واشتغلت الباقة",
  "Write the reason the owner will see":
    "اكتب السبب اللي رح يشوفه صاحب الصالون",
  "Request refused": "انرفض الطلب",
  "Approved salon not found": "ما لقينا الصالون المقبول",
  "Choose Pro or Business": "اختار Pro أو Business",
  "Free months given": "انعطت أشهر مجانية",
  "This salon has no paid time left. Give free months or confirm a payment.":
    "ما ضل وقت مدفوع لهالصالون. اعطيه أشهر مجانية أو أكّد دفعة.",
  "Plan changed": "تغيّرت الباقة",
  "Plan requests fetched successfully": "انجابت طلبات الباقات",
  "Only a request that is still waiting can be cancelled":
    "بس الطلب اللي لسا مستني بلغى",
  "Request cancelled": "انلغى الطلب",
  "Subscription fetched successfully": "انجاب اشتراكك",
  "You already have a request waiting. Cancel it first to send a new one.":
    "إلك طلب مستني. الغيه أول عشان تبعت واحد جديد.",
  "Request sent. We turn on your plan when we confirm the payment.":
    "انبعت الطلب. بنشغّل باقتك لما نأكّد الدفع.",

  // ---------- career profile ----------
  "At least one preferred work location is required":
    "حط مكان شغل واحد على الأقل",
  "Professional biography cannot exceed 2000 characters":
    "النبذة ما بصير تزيد عن 2000 حرف",
  "Resume URL must be a valid HTTP or HTTPS link to a PDF file":
    "رابط السيرة الذاتية لازم يكون رابط HTTP أو HTTPS صحيح لملف PDF",
  "Portfolio URL must be a valid HTTP or HTTPS link":
    "رابط معرض الأعمال لازم يكون رابط HTTP أو HTTPS صحيح",
  "Career profile information is valid": "معلومات الملف المهني صحيحة",
  "User profile not found": "ما لقينا ملفك",
  "User profile fetched successfully": "انجاب ملفك",
  "Career mode enabled and profile updated successfully":
    "تفعّل الملف المهني وتحدّثت معلوماتك",
  "Career profile information is required": "معلومات الملف المهني مطلوبة",
  "A valid date of birth is required": "لازم تاريخ ميلاد صحيح",
  "Career profile users must be at least 18 years old":
    "لازم يكون عمرك 18 سنة على الأقل للملف المهني",
  "Years of experience is required and cannot be negative":
    "سنين الخبرة مطلوبة وما بصير تكون سالبة",
  "At least one career skill is required": "حط مهارة وحدة على الأقل",
  "Users Fetched Successfully.": "انجابوا المستخدمين.",
  "Active Users Fetched Successfully.": "انجابوا المستخدمين المفعّلين.",
  "Blocked Users Fetched Successfully.": "انجابوا المستخدمين المحظورين.",
};

/**
 * Server messages with a number or a name inside. Each English pattern is
 * matched against the whole message; $1, $2 … are the matched parts.
 */
export const AR_SERVER_PATTERNS = [
  [
    /^Please wait (\d+) seconds before requesting another verification code\.$/,
    "استنى $1 ثانية قبل ما تطلب رمز تأكيد جديد.",
  ],
  [/^Keep the message under (\d+) characters$/, "خلّي الرسالة أقل من $1 حرف"],
  [
    /^This request expired because the salon did not answer within (\d+) hours$/,
    "انتهى الطلب لأن الصالون ما رد خلال $1 ساعة",
  ],
  [
    /^Owner note cannot exceed (\d+) characters$/,
    "ملاحظة الصالون ما بصير تزيد عن $1 حرف",
  ],
  [
    /^The service can be started at most (\d+) minutes before the appointment$/,
    "الخدمة بتبلّش بأكثر إشي $1 دقيقة قبل الموعد",
  ],
  [/^Extend by 5 to (\d+) minutes$/, "مدّد من 5 لـ $1 دقيقة"],
  [
    /^A service cannot run more than (\d+) minutes over its plan$/,
    "الخدمة ما بصير تطوّل أكثر من $1 دقيقة عن وقتها",
  ],
  [
    /^Closure saved\. (\d+) appointment\(s\) fall inside it; move or cancel them$/,
    "انحفظ الإغلاق. في $1 موعد داخلين فيه؛ غيّر موعدهم أو الغيهم",
  ],
  [
    /^Time off saved\. (\d+) appointment\(s\) of this employee fall inside it and need another employee$/,
    "انحفظت الإجازة. في $1 موعد لهالموظف داخلين فيها وبدهم موظف ثاني",
  ],
  [/^The employee is now a manager$/, "الموظف صار مدير"],
  [/^The employee is no longer a manager$/, "الموظف ما عاد مدير"],
  [/^(.+) is now a manager$/, "$1 صار مدير"],
  [/^(.+) is no longer a manager$/, "$1 ما عاد مدير"],
  [
    /^Comparison period: the start date cannot be after the end date\.?$/,
    "فترة المقارنة: تاريخ البداية ما بصير يكون بعد تاريخ النهاية",
  ],
  [
    /^Comparison period: choose a period of at most one year\.?$/,
    "فترة المقارنة: اختار فترة سنة أو أقل",
  ],
];

export default AR_SERVER;
