class Notifier < ActionMailer::Base

  def signup_notification(new_account)
    admin = User.find(1)
    recipients admin.email_address_with_name
    from       "\"GWSMS.org Administrator\" <admin@gwsms.org>"
    subject    "[GWSMS] New account signup!"
    body       :admin => admin, :new_account => new_account
    content_type "text/html"
  end
  
  def activation_notification(account)
    recipients account.email_address_with_name
    from       "\"GWSMS.org Administrator\" <admin@gwsms.org>"
    subject    "[GWSMS] Your gwsms.org account has been activated!"
    body       :account => account
    content_type "text/html"
  end
end
