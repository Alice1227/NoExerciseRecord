$(function() {
  //add record
  $(".add-btn").on("click", function() {
    let date = new Date();

    db.collection("records").add({
      name: $(this).attr("data-user"),
      amount: 10,
      date: date
    });
  });

  //delete record
  $(document).on("click", ".fa-trash", function() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: '#A0B1DE',
      cancelButtonColor: '#767892',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        let id = $(this).parents(".record").attr("data-id");
        db.collection("records").doc(id).delete();
      }
    });
  });

  //show all records
  $("#show-all-btn").on("click", function() {
    $(".add-btn").hide();
    $(".add-btn").attr("data-user", "all");
    $(".selected").removeClass("selected");
    $(this).addClass("selected");

    db.collection("records").orderBy("date").get().then(function(snapshot) {
      let sum = 0;
      $("#record-list").empty();
      snapshot.docs.forEach(function(doc) {
        renderRecord(doc);
        sum += doc.data().amount;
        $("#total").text(sum);
      });
    });
  });

  $("#show-eating-btn").on("click", function() {
    $(".add-btn").show();
    $(".add-btn").attr("data-user", "eating");
    $(".selected").removeClass("selected");
    $(this).addClass("selected");

    db.collection("records").where("name", "==", "eating").orderBy("date").get().then(function(snapshot) {
      let sum = 0;
      $("#record-list").empty();
      snapshot.docs.forEach(function(doc) {
        renderRecord(doc);
        sum += doc.data().amount;
        $("#total").text(sum);
      });
    });
  });

  $("#show-lucky-btn").on("click", function() {
    $(".add-btn").show();
    $(".add-btn").attr("data-user", "lucky");
    $(".selected").removeClass("selected");
    $(this).addClass("selected");

    db.collection("records").where("name", "==", "lucky").orderBy("date").get().then(function(snapshot) {
      let sum = 0;
      $("#record-list").empty();
      snapshot.docs.forEach(function(doc) {
        renderRecord(doc);
        sum += doc.data().amount;
        $("#total").text(sum);
      });
    });
  });
});

//render record html
function renderRecord(doc) {
  let d = doc.data().date.toDate();
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let date = d.getDate();

  let record = "";
  record += `<div class="record" data-id="${doc.id}">`;
  record += '<div class="row">';
  if (doc.data().name == "eating") {
    record += `<div class="col-4"><i class="far fa-user"></i> +${doc.data().amount}</div>`;
  } else if (doc.data().name == "lucky") {
    record += `<div class="col-4"><i class="fas fa-user"></i> +${doc.data().amount}</div>`;
  }
  record += `<div class="col-4 text-center">${year+"-"+month+"-"+date}</div>`;
  record += '<div class="col-4 text-right"><i class="fas fa-trash"></i></div>';
  record += '</div>';

  $("#record-list").append(record);
}

//db real-time listener
db.collection("records").orderBy("date").onSnapshot(function(snapshot) {
  let changes = snapshot.docChanges();
  let total = parseInt($("#total").text());
  changes.forEach(function(change) {
    if (change.type == "added") {
      renderRecord(change.doc);
      total += change.doc.data().amount;
    } else if (change.type == "removed") {
      $(`.record[data-id=${change.doc.id}]`).remove();
      total -= change.doc.data().amount;
    }
    $("#total").text(total);
  });
});